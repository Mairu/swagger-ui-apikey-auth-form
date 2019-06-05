import ApiKeyAuth from './ApiKeyAuth'
import ApiKeyAuthForm from './ApiKeyAuthForm'

export default function () {
  return {
    components: {
      apiKeyAuthForm: ApiKeyAuthForm
    },
    wrapComponents: {
      apiKeyAuth: ApiKeyAuth
    },
  }
}
