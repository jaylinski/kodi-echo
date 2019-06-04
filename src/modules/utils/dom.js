import { html as litTaggedTemplateLiteral, render as litRender } from './../npm/lit-html/lit-html.js';

/**
 * Tagged template literal for rendering.
 *
 * @returns {object}
 */
function html(strings, ...values) {
  return litTaggedTemplateLiteral(strings, ...values);
}

/**
 * Render output produced by the `html()` function.
 *
 * The most simple implementation would be `root.innerHTML = dom`.
 */
function render(dom, root) {
  litRender(dom, root);
}

export { html, render };
