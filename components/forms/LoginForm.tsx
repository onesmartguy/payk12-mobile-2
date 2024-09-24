import { Formik } from "formik"
import Box from "@/ui/Box"
import ImageView from "@/ui/ImageView"
import TextView from "@/ui/TextView"
import { Images } from "@/assets"
import * as Yup from 'yup';
import { useMutation } from "react-query"
import { loginUser } from "@/api/auth"
import { useSessionStore } from "@/stores"
import IconView from "../ui/IconView"
import TextField from "./inputs/TextField"
import { ActivityIndicator, Linking } from "react-native"
import { palette } from "@/utils/theme"
import Button from "@/ui/Button"


const LoginFormSchema = Yup.object().shape({
    username: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Password too short').required('Required'),
});
type LoginFormValues = typeof LoginFormSchema extends Yup.Schema<infer T> ? T : never;

type Props = {
    value?: LoginFormValues;
    onSubmit: (values: LoginFormValues) => Promise<void>;
}

export const LoginForm: React.FC<Props> = ({ value = {} as any, onSubmit: onSubmit }) => {
   
    const {mutate, isLoading} = useMutation('login', onSubmit, {onSuccess: (data) => {
        console.log('login success', data)
    }})

    return (
        <Formik
        initialValues={value}
        validationSchema={LoginFormSchema}
        onSubmit={(values) => mutate(values)}>
        {({ handleSubmit, errors }) => (
          <>
          <TextView>{JSON.stringify(errors)}</TextView>
          <Box flex={1} marginHorizontal="2xl">
            <Box
              flex={3}
              justifyContent="center"
              alignItems="center"
              marginTop="lg">
              <ImageView
                source={Images.logo}
                style={{ width: 40, resizeMode: 'contain' }}
              />
              <TextView
                textTransform="uppercase"
                letterSpacing={4}
                marginTop="s"
                color="headerText"
                fontWeight="500">
                BOX OFFICE
              </TextView>
            </Box>
            <Box flex={1}>
              {errors && (
                <Box
                  flex={1}
                  flexDirection="row"
                  backgroundColor="lightBlueNotice"
                  padding="s"
                  borderRadius={4}
                  justifyContent="center"
                  alignItems="center">
                  <IconView
                    icon='close'
                    color={palette.gray}
                    size={24}
                  />
                  <TextView fontSize={14} marginLeft="s">
                    Sorry, we can't find your account. Can we help you reset your
                    password?
                  </TextView>
                </Box>
              )}
            </Box>
            <Box flex={3}>
              <TextField
                placeholder="Username"
                name="username"
                icon="user"
              />
              <TextField
                placeholder="Password"
                name="password"
                secureTextEntry={true}
              />
              <Box flexDirection="row" marginTop="m">
                <TextView
                  variant="rowDetails"
                  onPress={() =>
                    Linking.openURL(
                      'https://secure.payk12.com/pages/recover-password.html',
                    )
                  }>
                  Forgot password?
                </TextView>
              </Box>
            </Box>

            <Box flex={3} justifyContent="center">
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <Button label="Login" variant="primary" onPress={handleSubmit as any} />
              )}
            </Box>
          </Box></>
        )}
      </Formik>
    )
}