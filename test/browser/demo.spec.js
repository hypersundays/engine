'use strict';

var expect = require('@playwright/test').expect;
var test = require('@playwright/test').test;

test('demo renders the baseline scene and animates nodes', async function ({ page }) {
    await page.goto('/');

    await page.waitForFunction(function() {
        var renderRoot = document.querySelector('.famous-dom-renderer');
        return renderRoot &&
            getComputedStyle(renderRoot).visibility === 'visible' &&
            document.querySelectorAll('.famous-dom-element').length >= 3;
    });

    await expect(page.getByText('Physics + animation baseline')).toBeVisible();

    await expect(page.locator('canvas.famous-webgl-renderer')).toHaveCount(1);
    await expect(page.locator('canvas.famous-webgl-renderer').evaluate(function(canvas) {
        return canvas.width > 0 && canvas.height > 0;
    })).resolves.toBe(true);

    var before = await page.locator('.famous-dom-element').evaluateAll(function(nodes) {
        return nodes.map(function(node) {
            return node.style.transform;
        });
    });

    await page.waitForTimeout(500);

    var after = await page.locator('.famous-dom-element').evaluateAll(function(nodes) {
        return nodes.map(function(node) {
            return node.style.transform;
        });
    });

    expect(after.some(function(transform, index) {
        return transform !== before[index];
    })).toBe(true);
});
