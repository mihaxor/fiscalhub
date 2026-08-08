import {expect, test} from '@playwright/test';

const rates = {
    EUR: 5,
    USD: 4.5,
    GBP: 6,
    HUF: 0.0125,
    IDR: 0.0003,
    ISK: 0.032,
    JPY: 0.029,
    KRW: 0.0031
};

test('converts multiplier currencies using normalized unit rates', async ({page}) => {
    await page.route('**/api/rates', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(rates)
        });
    });

    await page.goto('/');

    const leftCurrency = page.getByRole('combobox', {name: 'Left currency'});
    const leftValue = page.getByRole('spinbutton', {name: 'Left currency value'});
    const rightValue = page.getByRole('spinbutton', {name: 'Right currency value'});

    await expect(leftCurrency).toBeVisible();
    await leftValue.fill('100');

    for (const [currency, expectedValue] of [
        ['HUF', '1.25'],
        ['IDR', '0.03'],
        ['ISK', '3.20'],
        ['JPY', '2.90'],
        ['KRW', '0.31']
    ]) {
        await leftCurrency.selectOption(currency);
        await expect(rightValue).toHaveValue(expectedValue);
    }
});

test('hides the currency panel when rates are unavailable', async ({page}) => {
    await page.route('**/api/rates', async route => {
        await route.fulfill({
            status: 502,
            contentType: 'application/json',
            body: JSON.stringify({error: 'BNR rates are temporarily unavailable.'})
        });
    });

    const ratesResponse = page.waitForResponse(response => response.url().endsWith('/api/rates'));

    await page.goto('/');

    await expect((await ratesResponse).status()).toBe(502);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByTestId('currency-panel-loading')).toHaveCount(0);
    await expect(page.getByTestId('currency-panel')).toHaveCount(0);
});
