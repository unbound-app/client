import { Slider, Redesign, Forms } from '@metro/components';
import { useSettingsStore } from '@api/storage';
import { Constants, Theme } from '@metro/common';
import { i18n } from '@metro/common';
import Assets from '@api/assets';

import { TableRowGroupWrapper } from '@ui/components';
import { endStyle } from '@ui/components/TableRowGroupWrapper';
const { TableRow, TableSwitchRow, TableRowIcon } = Redesign;

export default function () {
	const settings = useSettingsStore('unbound');

	const Icons = {
		Tick: Assets.getIDByName('Check'),
        Cross: Assets.getIDByName('Small'),
		Play: Assets.getIDByName('play'),
        Pause: Assets.getIDByName('pause'),
        Duration: Assets.getIDByName('ic_timer_24px')
	};

	return <ReactNative.ScrollView>
		<TableRowGroupWrapper>
			<TableSwitchRow
				label={i18n.Messages.UNBOUND_ENABLED}
				subLabel={i18n.Messages.UNBOUND_TOASTS_DESC}
                icon={<TableRowIcon source={settings.get('toasts.enabled', true) ? Icons.Tick : Icons.Cross} />}
                value={settings.get('toasts.enabled', true)}
                onValueChange={() => settings.toggle('toasts.enabled', true)}
			/>
			<TableSwitchRow
				label={i18n.Messages.UNBOUND_TOASTS_ANIMATIONS}
				subLabel={i18n.Messages.UNBOUND_TOASTS_ANIMATIONS_DESC}
                icon={<TableRowIcon source={settings.get('toasts.animations', true) ? Icons.Play : Icons.Pause} />}
                value={settings.get('toasts.animations', true)}
                onValueChange={() => settings.toggle('toasts.animations', true)}
			/>
		</TableRowGroupWrapper>
		<TableRowGroupWrapper>
			<TableRow
				label={i18n.Messages.UNBOUND_TOAST_DURATION}
				trailing={<Forms.FormText size={Forms.FormTextSizes.MEDIUM}>
					{i18n.Messages.DURATION_SECONDS.format({ seconds: settings.get('toasts.duration', 3) })}
				</Forms.FormText>}
			/>
            <ReactNative.View style={endStyle}>
                <Slider
                    style={[{ marginHorizontal: 15, marginVertical: 5 }]}
                    value={settings.get('toasts.duration', 3)}
                    onValueChange={v => settings.set('toasts.duration', Math.round(v))}
                    minimumValue={3}
                    maximumValue={10}
                    minimumTrackTintColor={Theme.unsafe_rawColors.BRAND_500}
                    maximumTrackTintColor={Constants.UNSAFE_Colors.GREY2}
                />
            </ReactNative.View>
		</TableRowGroupWrapper>
		<Forms.FormHint>
			{i18n.Messages.UNBOUND_TOAST_DURATION_DESC}
		</Forms.FormHint>
	</ReactNative.ScrollView>;
}