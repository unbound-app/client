import { type Addon, type Manifest } from '@typings/managers';
import Storage, { getStore } from '@api/storage';
import Manager, { ManagerType } from './base';
import { Keys } from '@constants';

class Plugins extends Manager {
	public extension: string = 'js';

	constructor() {
		super(ManagerType.Plugins);

		this.icon = 'StaffBadgeIcon';
	}

	initialize() {
		for (const plugin of window.UNBOUND_PLUGINS ?? []) {
			const { manifest, bundle } = plugin;

			this.load(bundle, manifest);
		}

		this.initialized = true;
	}

	override getContextItems(addon: Addon, navigation: any) {
		return [
			...(addon.instance?.settings ? [{
				label: 'SETTINGS',
				icon: 'settings',
				action: () => navigation.push(Keys.Custom, {
					title: addon.data.name,
					render: addon.instance.settings
				})
			}] : []),
			...this.getBaseContextItems(addon)
		];
	}

	override handleBundle(bundle: string, manifest: Manifest) {
		if (Storage.get('unbound', 'recovery', false)) {
			return {
				start: () => { },
				stop: () => { }
			};
		}

		const iife = eval(`(manifest, settings) => { return ${bundle} }`);
		const settings = getStore(manifest.id);
		const payload = iife(manifest, settings);

		const res = typeof payload === 'function' ? payload() : payload;

		return res.default ?? res;
	}
}

export default new Plugins();