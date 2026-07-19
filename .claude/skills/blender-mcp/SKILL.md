---
description: Install, connect, and use ahujasid/blender-mcp for required authored 3D game assets. Use when game-polish or another approved asset task requires Blender-quality characters, creatures, buildings, terrain, set pieces, or hero props.
name: blender-mcp
metadata:
  skiller:
    source: .agents/rules/blender-mcp.mdc
---

# Blender MCP

Use only the official `ahujasid/blender-mcp` project:
https://github.com/ahujasid/blender-mcp

## Connection Gate

1. Detect exposed BlenderMCP tools and prove the connection with a real scene
   inspection plus a viewport screenshot. Process presence alone is not proof.
2. If unavailable, install missing prerequisites within current access:
   Blender 3+, Python 3.10+, and `uv`. Configure the current MCP client to run
   `uvx --python 3.11 blender-mcp` with `DISABLE_TELEMETRY=true`.
3. Install and enable the official `addon.py` in Blender, start its socket
   connection, then repeat the live proof. Use available computer control when
   GUI work is required.
4. If a client restart or unavailable human-only action still prevents a live
   connection, stop the calling lane with
   `POLISH_BLOCKED: BLENDER_MCP_REQUIRED` and state the single next action.
5. Never substitute procedural geometry, Tripo, or another generator merely
   because BlenderMCP is disconnected.

## Asset Work

- Save before arbitrary Blender Python execution.
- Blender 5.x `read_factory_settings` inside BlenderMCP can kill the add-on
  socket and leave exporters without a complete operator context — preserve the
  live source first, run destructive clean-room rebuild/export scripts in a
  separate headless Blender process, reopen the final `.blend` in GUI, then
  re-prove scene inspection plus viewport screenshot.
- Headless Workbench may ignore viewport background colors, and a Wireframe
  modifier can spike on acute triangles — use an explicit World background,
  the normal-check matcap, and a proof-only edge curve built from mesh edges.
- Rebuild scripts must delete every object datablock plus zero-user mesh,
  armature, material, image, and texture datablock before import; scene-only
  deletion leaves orphans and silently renames canonical runtime nodes to
  `.001` on repeated builds.
- For a bone-attached prop handoff, solve IK to the real grip, bake the visible
  chain, and switch sockets on that baked contact frame. A merely nearby pose
  produces a visible teleport.
- Use approved target images for modeling, materials, scale, and silhouette.
- Keep the editable `.blend` source and export a browser-ready `.glb` with
  verified scale, pivot, materials, topology, animation, and collision needs.
- Record source path, export path, viewport proof, and integration result in
  the active GDD.
