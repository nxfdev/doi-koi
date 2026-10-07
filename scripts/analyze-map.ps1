Add-Type -AssemblyName System.Drawing

$jpgPath = "E:\redo\public\assets\home\map\media_1791305958326.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($jpgPath)
$w = $bmp.Width
$h = $bmp.Height

Write-Host "Image dimensions: $w x $h"

# Find bounding box of dark pixels (black silhouette)
$minX = $w
$maxX = 0
$minY = $h
$maxY = 0
$blackCount = 0

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # Check if pixel is dark (silhouette)
        if ($c.R -lt 120 -and $c.G -lt 120 -and $c.B -lt 120) {
            $blackCount++
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Dark pixels count: $blackCount"
Write-Host "Bounds: minX=$minX, maxX=$maxX, minY=$minY, maxY=$maxY (width=$($maxX-$minX), height=$($maxY-$minY))"

$bmp.Dispose()
