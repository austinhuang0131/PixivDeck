// @flow
import React from 'react'
import IconButton from 'material-ui/IconButton'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import type {ColumnType} from '../../types/column'
import ColumnSetting from './ColumnSettinContainer'
import styles from './ColumnHeader.css'

const style = {
	color: '#999999',
}

type Props = {
	column: ColumnType,
	onTopClick: (event: Event) => void,
	onClose: () => void
};

type State = {
	open: bool;
};

class ColumnHeader extends React.Component {
	props: Props
	state: State = {
		open: false,
	}

	handleClick = () => {
		this.setState({open: !this.state.open})
	}

	render() {
		const {onClose, onTopClick, column} = this.props
		const {title} = column
		return (
			<div className={styles.wrap}>
				<div className={styles.header}>
					<div className={styles.item} onClick={this.handleClick}>
						<IconButton>
							<NavigationMenu color={style.color}/>
						</IconButton>
					</div>
					<div className={styles.title} onClick={onTopClick}>
						{title}
					</div>
					<div className={styles.item} onClick={onClose}>
						<IconButton>
							<NavigationClose color={style.color}/>
						</IconButton>
					</div>
				</div>
				<ColumnSetting
					open={this.state.open}
					id={column.id}
					minBookmarks={column.minBookmarks}
					/>
			</div>
		)
	}
}

export default ColumnHeader
