import type { IconProps, SectionProps, SvgIconProps } from '@typings/ui/forms';
import { View, ScrollView, Image } from 'react-native';
import { Discord } from '@api/metro/components';
import { Icons } from '@api/assets';
import { find } from '@api/metro';

import useStyles from './forms.style';


export const useFormStyles = useStyles;

export const TintedIcon = ({ source, size = 24, style, defaultSource = Icons['MoreHorizontalIcon'] }: IconProps) => {
	const styles = useStyles({ size });

	return <Image
		defaultSource={defaultSource}
		source={source}
		style={[
			styles.iconTint,
			{ width: size, height: size },
			style
		]}
	/>;
};

export const TintedSvgIcon = ({ size = 24, style, icon: Icon }: SvgIconProps) => {
	const styles = useStyles({ size });

	return <Icon
		style={[
			styles.iconTint,
			{ width: size, height: size },
			style
		]}
	/>;
};

export const Switch = find(m => m.FormSwitch && !m.FormTitle, { lazy: true });
export const Checkbox = find(m => m.FormCheckbox && !m.FormTitle, { lazy: true });
export const Section = ({ children, style, margin = true, ...props }: SectionProps) => {
	const styles = useStyles();

	return <ScrollView>
		<View style={[style, styles.sectionWrapper, { ...(margin ? { marginTop: 16 } : {}) }]}>
			<Discord.TableRowGroup {...props}>
				{children}
			</Discord.TableRowGroup>
		</View>
	</ScrollView>;
};

export default {
	Section,
	Switch,
	Checkbox
};