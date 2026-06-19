import pytest
from unittest.mock import MagicMock, patch
import pandas as pd

from src.data_management.backend_client import BackendClient
from src.data_management.service import DataManagementService


@patch("src.data_management.backend_client.requests")
def test_backend_client_get_latest_date(mock_requests):
    client = BackendClient("http://localhost:3000")
    
    # Mocking success response
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "success": True,
        "data": "2026-06-18T00:00:00.000Z"
    }
    mock_requests.get.return_value = mock_response

    latest_date = client.get_latest_date("VCB")
    assert latest_date == "2026-06-18T00:00:00.000Z"
    mock_requests.get.assert_called_with("http://localhost:3000/stocks/VCB/latest-date", timeout=10)


@patch("src.data_management.backend_client.requests")
def test_backend_client_post_history(mock_requests):
    client = BackendClient("http://localhost:3000")
    
    mock_response = MagicMock()
    mock_response.status_code = 201
    mock_requests.post.return_value = mock_response

    data_points = [{"date": "2026-06-19", "close": 10.0}]
    success = client.post_history("VCB", data_points)
    assert success is True
    mock_requests.post.assert_called_with(
        "http://localhost:3000/stocks/VCB/history",
        json=data_points,
        headers={"Content-Type": "application/json"},
        timeout=15
    )


def test_data_management_service_summary():
    mock_backend = MagicMock()
    mock_stock_service = MagicMock()
    
    service = DataManagementService(backend_client=mock_backend, stock_service=mock_stock_service)
    
    # Mock get_supported_symbols to return list
    service.get_supported_symbols = MagicMock(return_value=["VCB", "FPT"])
    service._get_total_records = MagicMock(side_effect=lambda sym: 100 if sym == "VCB" else 50)
    service._get_last_updated = MagicMock(return_value=None)
    service._get_status = MagicMock(return_value="needs_update")

    summary = service.get_summary()
    assert summary["total_stocks"] == 2
    assert summary["total_records"] == 150
    assert summary["needs_update"] == 2
    assert summary["updated"] == 0
