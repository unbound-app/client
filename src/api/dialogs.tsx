import { ReactNative as RN } from '@metro/common';
import { Redesign } from '@metro/components';
import { uuid } from '@utilities';

import { AlertProps } from '@typings/api/dialogs';

export function showAlert(options: AlertProps) {
	Redesign.openAlert(
		options.key ?? uuid(),
		<Redesign.AlertModal
				title={options.title}
				content={options.content}
				actions={<>
					<RN.View
						style={{
							marginTop: !options.content ? -32 : -8,
							marginBottom: (options.componentMargin ?? true) && options.component ? 8 : 0
						}}
					>
						{options.component}
					</RN.View>
					{options.buttons?.length > 0 && options.buttons.map(button => (
						React.createElement(
							Redesign[(button.closeAlert ?? true) ? 'AlertActionButton' : 'Button'],
							button
						)
					))}
					{(options.cancelButton ?? true) && (
						<Redesign.AlertActionButton
							text={'Cancel'}
							variant={'secondary'}
						/>
					)}
				</>}
			/>
	)
}

export default { showAlert };