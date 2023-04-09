Get-ChildItem -Filter "*0.jpg" | ForEach-Object { $newName = $_.Name -replace "_0.jpg", ".jpg"
   Rename-Item $_.FullName $newName            
}  