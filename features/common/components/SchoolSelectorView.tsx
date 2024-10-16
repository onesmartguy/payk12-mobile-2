import { Theme } from "@/utils/theme";
import { SchoolModel } from "../types";
import { BoxProps } from "@shopify/restyle";
import Box from "./Box";
import TextView from "./TextView";
import { FlatList } from "react-native";
import BasicListItem from "./BasicListItem";
import { orderBy } from "lodash";
import { useEffect } from "react";


interface Props extends BoxProps<Theme> {
  schools: SchoolModel[];
  onSelected: (school: SchoolModel) => void;
}
export const SchoolSelectorView: React.FC<Props> = ({
  schools,
  onSelected,
  ...props
}) => {
  const titleText = 'Schools';
  useEffect(() => {
    if(schools.length === 1) {
      onSelected(schools[0]);
    }
  }, [schools]);
  const handleSelectedSchool = (school: SchoolModel) => {
    if (onSelected) onSelected(school);
  };
  const renderHeader = () => (
    <Box flex={1}>
      <TextView variant="title" marginBottom="lg">
        {titleText}
      </TextView>
    </Box>
  );

  return (
    <Box flex={1} paddingHorizontal="lg" {...props}>
      <Box flex={1}>
        <FlatList
          data={orderBy(schools, ['name'])}
          ListHeaderComponent={() => renderHeader()}
          renderItem={context => (
            <BasicListItem
              key={context.item.id}
              label={context.item.name}
              onPress={() => handleSelectedSchool(context.item)}
            />
          )}
        />
      </Box>
    </Box>
  );
};
export default SchoolSelectorView;
