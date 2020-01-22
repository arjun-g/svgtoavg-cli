# svgtoavg-cli
A simple command-line tool to convert SVG file to AVG (Alexa Vector Graphics)

# Installation
```
npm install -g svgtoavg-cli
```

# Usage
```
svgtoavg [--bulk] [source-path] [dest-path]
```

# Convert Single File
```
svgtoavg image.svg image-avg.json
```

# Bulk Convert Files In Folder (including subfolders)
```
svgtoavg --bulk ./sourcefolder ./destfolder
```

