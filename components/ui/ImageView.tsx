import {Image, ImageProps} from 'react-native'
type Props = {} & ImageProps;
export const ImageView: React.FC<Props> = (props) =>{
    return (<Image {...props} />)
}
export default ImageView;