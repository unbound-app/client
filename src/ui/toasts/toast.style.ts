import { Constants, Theme } from '@api/metro/common';
import { Discord } from '@api/metro/components';


export default Discord.createStyles({
	toastShadow: Theme.shadows.SHADOW_MEDIUM,
	container: {
		backgroundColor: Theme.colors.TOAST_BG,
		borderWidth: 1,
		borderColor: Theme.colors.BORDER_STRONG,
		alignSelf: 'center',
		borderRadius: 18,
		width: '90%',
		maxWidth: 500,
		position: 'absolute',
		padding: 4,
		marginTop: 20,
		overflow: 'hidden'
	},
	wrapper: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	contentContainer: {
		marginLeft: 12,
		marginVertical: 8,
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center'
	},
	title: {
		fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
		color: Theme.colors.TEXT_NORMAL,
		fontSize: 14
	},
	content: {
		height: 'auto'
	},
	icon: {
		marginTop: 10,
		marginLeft: 12
	},
	buttons: {
		flexWrap: 'wrap',
		flexDirection: 'row',
		marginHorizontal: 12,
		marginBottom: 12,
		gap: 5
	},
	button: {
		width: '45%',
		flexGrow: 1,
		justifyContent: 'space-between'
	},
	bar: {
		backgroundColor: Theme.colors.REDESIGN_BUTTON_PRIMARY_BACKGROUND
	}
});