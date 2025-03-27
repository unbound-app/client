import { Section, useFormStyles } from '@ui/misc/forms';
import { Screens, SocialLinks } from '@constants';
import { useSettingsStore } from '@api/storage';
import { ScrollView, View } from 'react-native';
import { Discord } from '@api/metro/components';
import { Strings } from '@api/i18n';
import Toasts from '@api/toasts';
import Assets from '@api/assets';


const {
	TableSwitchRow,
	TextInput,
	TableRow,
	TableRowIcon
} = Discord;

export default function Developer() {
	const navigation = Discord.useNavigation();
	const settings = useSettingsStore('unbound');
	const { endStyle } = useFormStyles();

	const Icons = {
		AuditLog: Assets.getIDByName('ic_audit_log_24px'),
		Assets: Assets.getIDByName('StarIcon'),
		Trash: Assets.getIDByName('trash'),
		Retry: Assets.getIDByName('RetryIcon')
	};

	return <ScrollView>
		<Section title={Strings.UNBOUND_DEBUG_BRIDGE}>
			<TableSwitchRow
				label={Strings.UNBOUND_ENABLED}
				subLabel={Strings.UNBOUND_DEBUG_BRIDGE_DESC}
				value={settings.get('debug-bridge.enabled', false)}
				onValueChange={() => settings.toggle('debug-bridge.enabled', false)}
			/>
			<View style={endStyle}>
				<View style={{ margin: 8 }}>
					<TextInput
						isRound
						size='md'
						value={settings.get('debug-bridge.address', '192.168.0.35:9090')}
						onChange={v => settings.set('debug-bridge.address', v)}
						label={Strings.UNBOUND_DEBUG_BRIDGE_IP}
						disabled={!settings.get('debug-bridge.enabled', false)}
					/>
				</View>
			</View>
		</Section>
		<Section title={Strings.UNBOUND_LOADER}>
			<TableSwitchRow
				label={Strings.UNBOUND_ENABLED}
				subLabel={Strings.UNBOUND_LOADER_ENABLED_DESC}
				value={settings.get('loader.enabled', true)}
				onValueChange={() => settings.toggle('loader.enabled', true)}
			/>
			<TableSwitchRow
				label={Strings.UNBOUND_LOADER_DEVTOOLS}
				subLabel={Strings.UNBOUND_LOADER_DEVTOOLS_DESC}
				value={settings.get('loader.devtools', false)}
				onValueChange={() => settings.toggle('loader.devtools', false)}
			/>
			<TableSwitchRow
				label={Strings.UNBOUND_LOADER_UPDATER_FORCE}
				subLabel={Strings.UNBOUND_LOADER_UPDATER_FORCE_DESC}
				value={settings.get('loader.update.force', false)}
				onValueChange={() => settings.toggle('loader.update.force', false)}
			/>
			<View style={endStyle}>
				<View style={{ margin: 8 }}>
					<TextInput
						isRound
						size='md'
						value={settings.get('loader.update.url', SocialLinks.Bundle)}
						onChange={v => settings.set('loader.update.url', v)}
						label={Strings.UNBOUND_LOADER_CUSTOM_BUNDLE}
					/>
				</View>
			</View>
		</Section>
		<Section title={Strings.UNBOUND_ERROR_BOUNDARY}>
			<TableSwitchRow
				label={Strings.UNBOUND_ERROR_BOUNDARY}
				subLabel={Strings.UNBOUND_ERROR_BOUNDARY_DESC}
				value={settings.get('error-boundary', true)}
				onValueChange={() => settings.toggle('error-boundary', true)}
			/>
			<TableRow
				label={Strings.UNBOUND_ERROR_BOUNDARY_TRIGGER_TITLE}
				onPress={() => navigation.push(undefined, {
					title: null,

					// @ts-expect-error -- purposefully trip the boundary by rendering undefined
					render: () => <undefined />
				})}
				arrow
			/>
		</Section>
		<Section title={Strings.UNBOUND_LOGGING}>
			<TableRow
				label={Strings.UNBOUND_LOGGING_DEPTH}
				trailing={(
					<Discord.Text variant='text-sm/normal' color='text-muted'>
						{Strings.UNBOUND_LOGGING_DEPTH_DESC.format({ depth: settings.get('logging.depth', 2) })}
					</Discord.Text>
				)}
			/>
			<View style={[endStyle, { borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }]}>
				<Discord.Slider
					style={{ marginHorizontal: 15, marginVertical: 5 }}
					value={settings.get('logging.depth', 2)}
					onValueChange={v => settings.set('logging.depth', Math.round(v))}
					minimumValue={1}
					maximumValue={6}
					tapToSeek
				/>
			</View>
			<TableRow
				label={Strings.UNBOUND_DEBUG_LOGS}
				icon={<TableRowIcon source={Icons.AuditLog} />}
				onPress={() => navigation.push(Screens.Logs)}
				arrow
			/>
		</Section>
		<Section title={Strings.UNBOUND_MISC}>
			<TableRow
				label={Strings.UNBOUND_FORCE_GARBAGE_COLLECTION}
				icon={<TableRowIcon source={Icons.Trash} />}
				arrow
				onPress={async () => {
					await window.gc();
					Toasts.showToast({
						title: Strings.UNBOUND_GARBAGE_COLLECTION,
						content: Strings.UNBOUND_GARBAGE_COLLECTION_TOAST,
						icon: Icons.Trash
					});
				}}
			/>
			<TableRow
				label={Strings.UNBOUND_ASSET_BROWSER}
				icon={<TableRowIcon source={Icons.Assets} />}
				onPress={() => navigation.push(Screens.Assets)}
				arrow
			/>
		</Section>
		<View style={{ marginBottom: 50 }} />
	</ScrollView>;
}