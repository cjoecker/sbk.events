import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = 'playwright/.auth/user.json'

setup('authenticate facebook', async ({ page }) => {
	await page.goto('https://www.facebook.com/');
	await page.getByRole('button', { name: 'Allow all cookies' }).click();
	await page.getByLabel('email').fill('cj_9@hotmail.com');
	await page.getByLabel('password').fill('');
	await page.getByRole('button', { name: 'log in' }).click();

	await page.waitForURL('https://www.facebook.com/');
	await expect(page.getByRole('link', { name: 'Christian Jöcker', exact: true })).toBeVisible();
	await page.context().storageState({ path: authFile });
});
