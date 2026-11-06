# Diameter art from the 3D models

The Diameter pictures (`src/muscle-games/games/diameter/art/*.webp`) are rendered from the main site's 3D models
(`public/models/*.glb` in the Seminar_Projest clone, path set in `serve.mjs`) with the camera, lights and colours of its
/explore viewer. For each level: `<level>-grey` (the whole model in grey), `<level>-full` (in colour) and one
`<level>-<part>` per piece (the part alone, in colour, only where it is visible in the model).

```bash
MSYS_NO_PATHCONV=1 node scripts/diameter-art/drive.mjs render scripts/diameter-art/levels.json <out dir>
python scripts/diameter-art/to-webp.py <out dir> src/muscle-games/games/diameter/art
```

`levels.json`: per level the model, view direction, fit/zoom, see-through layers and the mesh names of each part
(`keys` = glTF node names, `mats` = material names); `alone` renders only the parts (the decoys). Headless Chrome with
SwiftShader; `node drive.mjs probe <model>` lists a model's node and material names.
