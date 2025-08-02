# Tauri + Vue + TypeScript Payroll App

- Simple local payroll calculator desktop application that uses SQLite to locally store data.
- Uses tauri/rust to create database file and tauri-sql-plugin to perform CRUD operations given user input.
- The table uses number related columns as INTEGER with the assumption that number input will be at most 8-byte values(64-bits) due to SQLite being only able to store 8-byte values(64-bits).
    - INTEGER data type was chosen instead of REAL data type due to the sole reason that floating-point numbers can sometimes leader to rounding errors.
    - If value ends up being more than 8 digits/bytes, workaround is required to convert the number to string when storing to SQLite and parse into integer/bigInt/double on retrieval. This is with the assumption that the string value is at most 256-bytes. If value comes larger than 256 bytes, workaround to storing as BLOB data type is required.
- Running `npm run tauri build` on windows creates executable.
- Prototype build. Nothing fancy. Just using primeng, shadcn-vue, ag-grid for placeholder components and has basic local CRUD. 


## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).
