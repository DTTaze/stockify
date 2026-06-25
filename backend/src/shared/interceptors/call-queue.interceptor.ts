import {
  AuditService,
  CacheService,
  ErrorLog,
  SET_EXPIRE_POLICY,
} from 'mvc-common-toolkit';
import {
  Observable,
  TimeoutError,
  catchError,
  finalize,
  throwError,
  timeout,
} from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
  SetMetadata,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import {
  APP_ACTION,
  DEFAULT_MAX_CONCURRENT_CALL,
  HEADER_KEY,
  INJECTION_TOKEN,
  METADATA_KEY,
} from '@shared/constants';

export const MaxConcurrencyCall = (maxConcurrency: number) =>
  SetMetadata(METADATA_KEY.MAX_CONCURRENCY_CALL, maxConcurrency);

@Injectable()
export class CallQueueInterceptor implements NestInterceptor {
  protected logger = new Logger(CallQueueInterceptor.name);

  constructor(
    protected reflector: Reflector,

    @Inject(INJECTION_TOKEN.AUDIT_SERVICE)
    protected auditService: AuditService,

    @Inject(INJECTION_TOKEN.REDIS_SERVICE)
    protected cacheService: CacheService,
  ) {}

  public async intercept(
    ctx: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const httpReq: any = ctx.switchToHttp().getRequest();
    const logId = httpReq.headers[HEADER_KEY.LOG_ID];

    const userIP =
      httpReq.ip ||
      httpReq.headers['x-forwarded-for']?.split(',').shift() ||
      httpReq.socket?.remoteAddress ||
      'unknown_ip';

    const method = httpReq.method;
    const user = httpReq.activeUser || httpReq.user || { id: userIP };

    const reqUrl = httpReq.url;
    const userId = user.id;

    const cacheKey = `call_queue:${userId}:${method}:${reqUrl}`;

    const maxConcurrencyCall =
      this.reflector.get(METADATA_KEY.MAX_CONCURRENCY_CALL, ctx.getHandler()) ||
      DEFAULT_MAX_CONCURRENT_CALL;

    // Atomic increment using Redis
    const newValue = await this.cacheService.incrBy(cacheKey, 1);

    // Set 3 minute TTL (180s) only if not already set, to prevent orphaned locks on crash
    await this.cacheService.expire(cacheKey, {
      policy: SET_EXPIRE_POLICY.IF_NOT_EXISTS,
      value: 180,
    });

    if (newValue > maxConcurrencyCall) {
      // Revert the increment
      await this.cacheService.decrBy(cacheKey, 1);

      this.logger.warn(
        `user ${user.id} exceeded concurrency limit for cache key ${cacheKey}`,
      );
      this.auditService.emitLog(
        new ErrorLog({
          logId,
          userId: user.id,
          message: `user ${user.id} exceeded concurrency limit for cache key ${cacheKey}`,
          action: APP_ACTION.API_CALL,
        }),
      );

      return throwError(
        () => new ForbiddenException('Max concurrency call reached!'),
      );
    }

    return next.handle().pipe(
      timeout(60 * 3 * 1000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          this.logger.error(
            `Timeout error for user ${user.id}. Path: ${cacheKey}`,
          );

          this.auditService.emitLog(
            new ErrorLog({
              logId,
              userId: user.id,
              message: `Timeout error for user ${user.id}`,
              action: APP_ACTION.API_CALL,
              metadata: {
                cacheKey,
              },
            }),
          );
        }
        return throwError(() => err);
      }),
      finalize(() => {
        const decrTask = async () => {
          try {
            const val = await this.cacheService.decrBy(cacheKey, 1);
            if (val <= 0) {
              await this.cacheService.del(cacheKey);
            }
          } catch (e) {
            this.logger.error(
              `Failed to decrement concurrency counter for key ${cacheKey}: ${e}`,
            );
          }
        };
        decrTask();
      }),
    );
  }
}

export function UseCallQueue(maxConcurrency = 1) {
  return applyDecorators(
    MaxConcurrencyCall(maxConcurrency),
    UseInterceptors(CallQueueInterceptor),
  );
}
