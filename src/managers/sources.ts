import Manager, { ManagerType, isValidManager } from './base';
import downloadFile from '@utilities/downloadFile';
import { DCDFileManager } from '@api/storage';
import { Dispatcher } from '@metro/common';
import { createPatcher } from '@patcher';
import { Regex } from '@constants';

import type { Addon, Manifest } from '@typings/managers';

type SourceManifest = Pick<Manifest, 'id' | 'name' | 'description' | 'icon' | 'url'> & {
	iconType?: string;
	tags: string[];
	addons: (Pick<Manifest, 'name'> & {
		type: string;
		screenshots: string[];
		changelog: string;
		manifest: string;
		readme: string;
	})[];
};

type Bundle = {
	manifest: Manifest;
	changelog: Record<string, string[]>;
	readme?: string;
	screenshots?: string[];
}[];

class Sources extends Manager {
	public patcher: ReturnType<typeof createPatcher>;
	public extension: string = 'json';
	public signal: AbortSignal;
	public sources: Record<Manifest['id'], Manifest['url']>;

	// Reload sources after 5 seconds or whenever the user
	// accesses the Sources page, whichever happens sooner
	public refreshed = false;

	constructor() {
		super(ManagerType.Sources);

		this.patcher = createPatcher('sources');
		this.icon = 'grid';
	}

	getDefaultSourceUrls() {
		return ['https://github.com/unbound-mod/sources/blob/main/test/test.json?raw=true'];
	}

	async initialize() {
		this.sources = this.settings.get('sources', null);

		if (!this.sources) {
			const defaultSources = this.getDefaultSourceUrls();

			for (const url of defaultSources) {
				await this.install(url);
			}
		}

		for (const source of Object.keys(this.sources)) {
			const manifest = await DCDFileManager.readFile(`${DCDFileManager.DocumentsDirPath}/${this.path}/${source}/manifest.json`, 'utf8');
			const bundle = await DCDFileManager.readFile(`${DCDFileManager.DocumentsDirPath}/${this.path}/${source}/bundle.json`, 'utf8');

			this.load(JSON.parse(bundle), JSON.parse(manifest) as Manifest);
		}

		Dispatcher.subscribe('REFRESH_SOURCES', () => {
			for (const url of Object.values(this.sources)) {
				this.install(url);
			}
		});

		setTimeout(() => {
			if (!this.refreshed) {
				this.refreshed = true;
				Dispatcher.dispatch({ type: 'REFRESH_SOURCES' });
			}
		}, 5000);

		this.initialized = true;
	}

	override async onFinishedInstalling(addon: Addon, manifest: SourceManifest): Promise<Addon> {
		this.sources ??= {};
		this.sources[manifest.id] = manifest.url;
		this.settings.set('sources', this.sources);

		return addon;
	}

	override async fetchBundle(_: string, _manifest: Manifest, signal: AbortSignal, setState?: Fn<any>): Promise<any> {
		const manifest = _manifest as unknown as SourceManifest;
		const bundle = [] satisfies Bundle;

		for (const addon of manifest.addons) {
			const parsed = {} as Bundle[number];

			const addonManifest = await fetch(addon.manifest, { cache: 'no-cache', signal })
				.then(res => res.json())
				.catch(console.error) as Manifest;

			try {
				this.validateAddonManifest(addonManifest);
			} catch (e) {
				this.logger.error('Failed to validate addon manifest:', e);
			}

			Object.assign(parsed, { manifest: addonManifest });

			const changelog = await fetch(addon.changelog, { cache: 'no-cache', signal })
				.then(res => res.json())
				.catch(console.error);

			try {
				this.validateChangelog(changelog);
			} catch (e) {
				this.logger.error('Failed to validate addon changelog:', e);
			}

			Object.assign(parsed, { changelog });

			if (addon.readme) {
				const path = `${this.path}/${manifest.id}/${addonManifest.id}/readme.md`;

				downloadFile(addon.readme, path, signal);
				Object.assign(parsed, { readme: path });
			}

			if (addon.screenshots) {
				const screenshots = [];

				for (const screenshot of addon.screenshots) {
					const name = screenshot.substring(screenshot.lastIndexOf('/') + 1);
					const path = `${this.path}/${manifest.id}/${addonManifest.id}/screenshots/${name}`;
					downloadFile(screenshot, path, signal);

					screenshots.push(path);
				}

				Object.assign(parsed, { screenshots });
			}

			bundle.push(parsed);
		}

		return bundle;
	}

	override save(_bundle: string, manifest: Manifest) {
		const bundle = _bundle as unknown as Bundle;
		DCDFileManager.writeFile('documents', `${this.path}/${manifest.id}/bundle.json`, JSON.stringify(bundle, null, 2), 'utf8');
		DCDFileManager.writeFile('documents', `${this.path}/${manifest.id}/manifest.json`, JSON.stringify(manifest, null, 2), 'utf8');
	}

	validateAddonManifest(manifest: Manifest) {
		if (!manifest.name || typeof manifest.name !== 'string') {
			throw new Error('Manifest property "name" must be of type string');
		} else if (!manifest.description || typeof manifest.description !== 'string') {
			throw new Error('Manifest property "description" must be of type string.');
		} else if (!manifest.authors || (typeof manifest.name !== 'object' && !Array.isArray(manifest.authors))) {
			throw new Error('Manifest property "authors" must be of type array.');
		} else if (!manifest.version || typeof manifest.version !== 'string' || !Regex.SemanticVersioning.test(manifest.version)) {
			throw new Error('Manifest property "version" must be of type string and match the semantic versioning pattern.');
		} else if (!manifest.id || typeof manifest.id !== 'string') {
			throw new Error('Manifest property "id" must be of type string and match a "eternal.unbound" pattern.');
		}
	}

	validateChangelog(changelog: Record<string, string[]>) {
		// Ensure every key is a semantic version and every value is an array of strings
		if (!Object.keys(changelog).every(key => typeof key === 'string' && Regex.SemanticVersioning.test(key))
			|| !Object.values(changelog).every(value => Array.isArray(value) && value.every(message => typeof message === 'string'))) {
			throw new Error('The changelog object must be an object of string keys and string[] values, where the key is the version and the value is an array of strings.');
		}
	}

	override validateManifest(_manifest: Manifest): void {
		const manifest = _manifest as unknown as SourceManifest;

		if (!manifest.name || typeof manifest.name !== 'string') {
			throw new Error('Source property "name" must be of type string.');
		} else if (!manifest.id || typeof manifest.id !== 'string') {
			throw new Error('Source property "id" must be of type string and match a "eternal.unbound" pattern.');
		} else if (manifest.tags && (!Array.isArray(manifest.tags) || !manifest.tags.every(tag => typeof tag === 'string'))) {
			throw new Error('Source property "tags" must either not exist or be an array of type "string".');
		} else if (!manifest.addons || !Array.isArray(manifest.addons) || manifest.addons.length < 1) {
			throw new Error('Source must contain at least 1 addon.');
		} else if (manifest.iconType && (typeof manifest.iconType !== 'string' || !['basic', 'custom'].includes(manifest.iconType))) {
			throw new Error('Source icon type must be of type "string" and must be either "basic" or "custom"');
		}

		for (const addon of manifest.addons) {
			if (!addon.name || typeof addon.name !== 'string') {
				throw new Error('Addon property "name" must be of type string');
			} else if (!addon.type || typeof addon.type !== 'string' || !isValidManager(addon.type)) {
				throw new Error('Addon property "type" must be of type string and a valid manager, got ' + addon.type);
			} else if (addon.changelog && typeof addon.changelog !== 'string') {
				throw new Error('Addon property "changelog" must be of type string.');
			} else if (addon.readme && typeof addon.readme !== 'string') {
				throw new Error('Addon property "readme" must be of type string.');
			} else if (!addon.manifest || typeof addon.manifest !== 'string') {
				throw new Error('Addon property "manifest" must be of type string.');
			} else if (addon.screenshots && (!Array.isArray(addon.screenshots) || !addon.screenshots.every(screenshot => typeof screenshot === 'string'))) {
				throw new Error('Addon property "screenshots" must either not exist or be an array of "string".');
			}
		}
	}

	override isEnabled(id: string): boolean {
		return true;
	}

	override handleBundle(bundle: string): string {
		return bundle;
	}
}

export default new Sources();