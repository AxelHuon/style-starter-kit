function hexToRgb(hex) {
    let r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}
function rgbToHex(r, g, b, a) {
    let red = r.toString(16).padStart(2, "0"), green = g.toString(16).padStart(2, "0"), blue = b.toString(16).padStart(2, "0"), alpha = Math.round(a * 255).toString(16).padStart(2, "0");
    return "#" + red + green + blue + alpha;
}
function generateColorVariantsTS(hexColor, name) {
    const [r, g, b] = hexToRgb(hexColor);
    const variants = {};
    for (let i = 1; i <= 9; i++) {
        const alpha = i * 0.1;
        const labelTS = `${name.toUpperCase()}_${i}00`;
        const variantColor = rgbToHex(r, g, b, alpha);
        variants[labelTS] = variantColor;
    }
    return variants;
}
function generateColorVariantsCSS(hexColor, name) {
    const [r, g, b] = hexToRgb(hexColor);
    const variants = {};
    for (let i = 1; i <= 9; i++) {
        const alpha = i * 0.1;
        const labelCSS = `--${name}--${i}00`;
        const variantColor = rgbToHex(r, g, b, alpha);
        variants[labelCSS] = variantColor;
    }
    return variants;
}
export {};
