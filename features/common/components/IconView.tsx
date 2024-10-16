import { IconName, IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, type FontAwesomeIconStyle } from '@fortawesome/react-native-fontawesome'
import { faTriangle, faSquare, faTimesCircle} from '@fortawesome/pro-solid-svg-icons';
import { TouchableHighlight, ViewProps } from 'react-native';
type Props = ViewProps & {
    size?: number;
    color?: string;
    icon: IconShape;
    onPress?: () => void;
}
type IconShape = "triangle" | "square" | "circle" | 'close';
export const IconView: React.FC<Props> = ({ icon, onPress, ...props }) => {

    const iconDef = icon as IconName;

    function determineShape(param: IconShape): IconProp {
        switch (param) {
            case "triangle":
                return faTriangle;
            case "square":
                return faSquare;
            case "close":
                return faTimesCircle
            default:
                return null as any
        }
    }
    const renderIcon = () => <FontAwesomeIcon  icon={determineShape(icon)} {...props as any} />;
    if (!onPress) return renderIcon();
    return (
        <TouchableHighlight onPress={onPress}>
            {renderIcon()}
        </TouchableHighlight>);
    return;
};
export default IconView;