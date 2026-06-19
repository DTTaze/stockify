import pytest
from unittest.mock import MagicMock, patch
import pandas as pd

from src.data_management.backend_client import BackendClient
from src.data_management.service import DataManagementService


@pytest.fixture
def mock_backend_response():
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "success": True,
        "data": "2026-06-18T00:00:00.000Z"
    }
    return mock_response


@patch("src.data_management.backend_client.requests")
def test_backend_client_get_latest_date_returns_value(mock_requests, mock_backend_response):
    client = BackendClient("http://localhost:3000")
    mock_requests.get.return_value = mock_backend_response

    latest_date = client.get_latest_date("VCB")
    assert latest_date == "2026-06-18T00:00:00.000Z"


@patch("src.data_management.backend_client.requests")
def test_backend_client_get_latest_date_calls_correct_url(mock_requests, mock_backend_response):
    client = BackendClient("http://localhost:3000")
    mock_requests.get.return_value = mock_backend_response

    client.get_latest_date("VCB")
    mock_requests.get.assert_called_with("http://localhost:3000/stocks/VCB/latest-date", timeout=10)


@patch("src.data_management.backend_client.requests")
def test_backend_client_post_history_returns_success(mock_requests):
    client = BackendClient("http://localhost:3000")
    mock_response = MagicMock()
    mock_response.status_code = 201
    mock_requests.post.return_value = mock_response

    data_points = [{"date": "2026-06-19", "close": 10.0}]
    success = client.post_history("VCB", data_points)
    assert success is True


@patch("src.data_management.backend_client.requests")
def test_backend_client_post_history_calls_correct_url(mock_requests):
    client = BackendClient("http://localhost:3000")
    mock_response = MagicMock()
    mock_response.status_code = 201
    mock_requests.post.return_value = mock_response

    data_points = [{"date": "2026-06-19", "close": 10.0}]
    client.post_history("VCB", data_points)
    mock_requests.post.assert_called_with(
        "http://localhost:3000/stocks/VCB/history",
        json=data_points,
        headers={"Content-Type": "application/json"},
        timeout=15
    )


@pytest.fixture
def mock_summary_service():
    mock_backend = MagicMock()
    mock_stock_service = MagicMock()
    
    service = DataManagementService(backend_client=mock_backend, stock_service=mock_stock_service)
    service.get_supported_symbols = MagicMock(return_value=["VCB", "FPT"])
    service._get_total_records = MagicMock(side_effect=lambda sym: 100 if sym == "VCB" else 50)
    service._get_last_updated = MagicMock(return_value=None)
    service._get_status = MagicMock(return_value="needs_update")
    return service


def test_data_management_service_summary_total_stocks(mock_summary_service):
    summary = mock_summary_service.get_summary()
    assert summary["total_stocks"] == 2


def test_data_management_service_summary_total_records(mock_summary_service):
    summary = mock_summary_service.get_summary()
    assert summary["total_records"] == 150


def test_data_management_service_summary_needs_update(mock_summary_service):
    summary = mock_summary_service.get_summary()
    assert summary["needs_update"] == 2


def test_data_management_service_summary_updated(mock_summary_service):
    summary = mock_summary_service.get_summary()
    assert summary["updated"] == 0
