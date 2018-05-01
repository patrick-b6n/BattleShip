const { task, context } = require("fuse-box/sparky");
const { FuseBox, QuantumPlugin, CSSPlugin, SassPlugin } = require("fuse-box");

context(
    class {
        getConfig() {
            return FuseBox.init({
                homeDir: "src",
                target: "browser@es6",
                output: "dist/$name.js",
                alias: {
                    "@src": "~/",
                },
                plugins: [
                    [SassPlugin({ outputStyle: 'compressed', importer: true }), CSSPlugin()],
                    [CSSPlugin()],
                    this.isProduction && QuantumPlugin()],
                useTypescriptCompiler: true,
                experimentalFeatures: true,
                sourceMaps: true
            });
        }
    }
);

task("default", async context => {
    const fuse = context.getConfig();
    fuse
        .bundle("app")
        .instructions("> index.ts")
        .watch();

    await fuse.run();
});

task("dev", async context => {
    const fuse = context.getConfig();
    fuse.bundle("app").instructions("> index.ts");

    await fuse.run();
});

task("prod", async context => {
    context.isProduction = true;
    const fuse = context.getConfig();
    fuse.bundle("app").instructions("> index.ts");

    await fuse.run();
});
