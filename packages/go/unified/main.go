package unified

type Unified struct {
	ClientID     string
	ClientSecret *string
	RedirectUri  string
	Scopes       []string
}

type NewUnifiedParams struct {
	ClientID     string   // The client ID of your application
	RedirectUri  string   // The URI to redirect the user after the authorization
	Scopes       []string // The scopes to request from the user
	ClientSecret nilStr   // The client secret of your application. If none is provided, PKCE will be used by default.
}

type maybeError *struct {
	Message string `json:"message"`
}

type UnifiedError struct {
	StatusCode int
	Message    string
	From       string // one of: "local", "unified-api". Local indicates that the error was originated from the local code, while unified-api indicates that the error was returned by the Unified API.
}

func fromError(err error) *UnifiedError {
	if err == nil {
		return nil
	}

	return &UnifiedError{
		StatusCode: 500,
		Message:    err.Error(),
		From:       "local",
	}
}

// New creates a new Unified instance.
// see: openID configuration (https://acconts.rtrampox.com.br/.well-known/openid-configuration)
func New(params NewUnifiedParams) *Unified {
	return &Unified{
		ClientID:     params.ClientID,
		ClientSecret: params.ClientSecret,
		RedirectUri:  params.RedirectUri,
		Scopes:       params.Scopes,
	}
}
