import { Theme, i18n, React, ReactNative as RN, StyleSheet } from '@metro/common';
import { Invite, Links, Screens } from '@constants';
import { useSettingsStore } from '@api/storage';
import { Invites } from '@metro/actions';
import { reload } from '@api/native';
import { Dialog } from '@metro/ui';
import * as Icon from '@ui/icons';
import Assets from '@api/assets';

import Plugins from '@managers/plugins';
import Themes from '@managers/themes';

import { Forms, Navigation } from '@metro/components';
import Developer from './developer';
import Toasts from './toasts';

const styles = StyleSheet.createThemedStyleSheet({
  trailingText: {
    color: Theme.colors.TEXT_MUTED
  },
  container: {
    marginBottom: 50
  }
});

function General() {
  const navigation = Navigation.useNavigation();
  const settings = useSettingsStore('enmity');

  const Icons = {
    Twitter: Assets.getIDByName('img_account_sync_twitter_white'),
    GitHub: Assets.getIDByName('img_account_sync_github_white'),
    Development: Assets.getIDByName('ic_progress_wrench_24px'),
    Toasts: Assets.getIDByName('ic_notification_settings'),
    Discord: Assets.getIDByName('Discord'),
  };

  return <RN.ScrollView>
    <RN.KeyboardAvoidingView
      enabled={true}
      behavior='position'
      style={styles.container}
      keyboardVerticalOffset={100}
      contentContainerStyle={{ backfaceVisibility: 'hidden' }}
    >
      <Forms.FormSection>
        <Forms.FormRow
          label={i18n.Messages.ENMITY_TOAST_SETTINGS}
          leading={<Forms.FormRow.Icon source={Icons.Toasts} />}
          trailing={Forms.FormRow.Arrow}
          onPress={() => navigation.push(Screens.Custom, {
            title: i18n.Messages.ENMITY_TOAST_SETTINGS,
            render: Toasts
          })}
        />
        <Forms.FormDivider />
        <Forms.FormRow
          label={i18n.Messages.ENMITY_DEVELOPMENT_SETTINGS}
          leading={<Forms.FormRow.Icon source={Icons.Development} />}
          trailing={Forms.FormRow.Arrow}
          onPress={() => navigation.push(Screens.Custom, {
            title: i18n.Messages.ENMITY_DEVELOPMENT_SETTINGS,
            render: Developer
          })}
        />
      </Forms.FormSection>
      <Forms.FormSection>
        <Forms.FormRow
          label={i18n.Messages.ENMITY_RECOVERY_MODE}
          subLabel={i18n.Messages.ENMITY_RECOVERY_MODE_DESC}
          trailing={<Forms.FormSwitch
            value={settings.get('recovery', false)}
            onValueChange={() => {
              settings.toggle('recovery', false);
              Dialog.confirm({
                title: i18n.Messages.ENMITY_CHANGE_RESTART,
                body: i18n.Messages.ENMITY_CHANGE_RESTART_DESC,
                confirmText: i18n.Messages.ENMITY_RESTART,
                onConfirm: async () => await reload()
              });
            }}
          />}
        />
      </Forms.FormSection>
      <Forms.FormSection title={i18n.Messages.ENMITY_STATS}>
        <Forms.FormRow
          label='Installed Plugins'
          leading={<Icon.Puzzle width={24} height={24} />}
          trailing={() => <RN.Text style={styles.trailingText}>
            {Plugins.addons.length}
          </RN.Text>}
        />
        <Forms.FormDivider />
        <Forms.FormRow
          label='Installed Themes'
          leading={<Icon.Palette width={24} height={24} />}
          trailing={() => <RN.Text style={styles.trailingText}>
            {Themes.addons.length}
          </RN.Text>}
        />
      </Forms.FormSection>
      <Forms.FormSection title='Links'>
        <Forms.FormRow
          label='Discord Server'
          leading={<Forms.FormRow.Icon source={Icons.Discord} />}
          trailing={Forms.FormRow.Arrow}
          onPress={() => Invites.acceptInviteAndTransitionToInviteChannel({ inviteKey: Invite })}
        />
        <Forms.FormDivider />
        <Forms.FormRow
          label='GitHub'
          leading={<Forms.FormRow.Icon source={Icons.GitHub} />}
          trailing={Forms.FormRow.Arrow}
          onPress={() => RN.Linking.openURL(Links.GitHub)}
        />
        <Forms.FormDivider />
        <Forms.FormRow
          label='Twitter'
          leading={<Forms.FormRow.Icon source={Icons.Twitter} />}
          trailing={Forms.FormRow.Arrow}
          onPress={() => RN.Linking.openURL(Links.Twitter)}
        />
      </Forms.FormSection>
    </RN.KeyboardAvoidingView>
  </RN.ScrollView>;
}

export default General;