function Get-Recommendation {
    
    $json = '{"movie_id": [1, 2, 48], "user_id": 71568, "rating": [5, 5, 5]}'
    $headers = @{ "Content-Type" = "application/json" }

    $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/ratings' -Method POST -Headers $headers -Body $json
    if ($response.StatusCode -eq 200) {
        Write-Output "Success: $($response.Content)"
    } else {
        Write-Output "Error: $($response.StatusCode) - $($response.Content)"
    }
}
Get-Recommendation
