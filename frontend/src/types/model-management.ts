import { ModelStatus } from "@/constants/stock";

export interface ModelSummary {
  total_models: number;
  active_models: number;
  inactive_models: number;
  total_versions: number;
  failed_models: number;
}

export interface ModelItem {
  id: string;
  name: string;
  version: string;
  type: string;
  status: ModelStatus;
  environment: string;
  updated_at: string;
}

export interface ModelDetail extends ModelItem {
  metadata: Record<string, unknown>;
  metrics: Record<string, unknown>;
  training_info: Record<string, unknown>;
  deploy_history: ModelDeployHistory[];
}

export interface ModelDeployHistory {
  version: string;
  deployed_at: string;
  environment: string;
  status: string;
}

export interface ModelVersion {
  id: string;
  version: string;
  deployed_at: string;
  status: string;
}
