import { describe, expect, it } from 'vitest';
import { resolveSiteUrl } from '../src/config/site';

describe('resolveSiteUrl', () => {
  it('uses SITE_URL and normalizes it to an origin', () => {
    expect(resolveSiteUrl({ SITE_URL: 'https://gps.example.org' })).toBe('https://gps.example.org');
    expect(resolveSiteUrl({ SITE_URL: ' https://gps.example.org/ ' })).toBe('https://gps.example.org');
    expect(resolveSiteUrl({ SITE_URL: 'https://gps.example.org/some/path?x=1' })).toBe('https://gps.example.org');
  });

  it('falls back to a placeholder for local builds and GitHub Actions', () => {
    expect(resolveSiteUrl({})).toBe('https://example.com');
    expect(resolveSiteUrl({ CI: 'true', GITHUB_ACTIONS: 'true' })).toBe('https://example.com');
    expect(resolveSiteUrl({ SITE_URL: '   ' })).toBe('https://example.com');
  });

  // A deploy without SITE_URL looks fine but ships canonical/hreflang/sitemap URLs pointing at
  // example.com. This happened on the first production deploy; the build must fail instead.
  it('refuses to build on Cloudflare without SITE_URL', () => {
    expect(() => resolveSiteUrl({ WORKERS_CI: '1' })).toThrow(/SITE_URL/);
    expect(() => resolveSiteUrl({ CF_PAGES: '1' })).toThrow(/SITE_URL/);
    expect(() => resolveSiteUrl({ WORKERS_CI: '1', SITE_URL: '' })).toThrow(/Build variables/);
  });

  it('refuses the placeholder itself on Cloudflare', () => {
    expect(() => resolveSiteUrl({ WORKERS_CI: '1', SITE_URL: 'https://example.com' })).toThrow(/placeholder/);
  });

  it('builds on Cloudflare when SITE_URL is set', () => {
    expect(resolveSiteUrl({ WORKERS_CI: '1', SITE_URL: 'https://gps-tools.rtstts119.workers.dev/' })).toBe(
      'https://gps-tools.rtstts119.workers.dev',
    );
  });

  it('rejects values that are not an http(s) URL, wherever the build runs', () => {
    expect(() => resolveSiteUrl({ SITE_URL: 'gps.example.org' })).toThrow(/https:\/\//);
    expect(() => resolveSiteUrl({ SITE_URL: 'ftp://gps.example.org' })).toThrow(/https:\/\//);
  });
});
