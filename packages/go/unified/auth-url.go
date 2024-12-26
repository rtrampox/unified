package unified

import (
	"net/url"

	"github.com/rtrampox/unified/go/unified/helpers"
)

type AuthorizationURLBody struct {
	Url           string                 // The Unified Authorization URL with the required parameters
	CodeChallenge *helpers.CodeChallenge // The code challenge generated for this request. Only returned when CodeChallenge param is true
}

type AuthorizationURLParams struct {
	Prompt        *string // nullable. One of "none", "login", "consent", "select_account"
	State         *string // nullable. A random string to protect against CSRF attacks
	CodeChallenge bool    // If true, generates a code challenge and adds it to the URL
}

// AuthorizationURL generates the URL to redirect the user to the authorization page.
func (u *Unified) AuthorizationURL(params AuthorizationURLParams) (*AuthorizationURLBody, error) {
	url := url.URL{
		Scheme: "https",
		Host:   "accounts.rtrampox.com.br",
		Path:   "/oauth/authorize",
	}
	q := url.Query()

	var chall *helpers.CodeChallenge
	var err error

	if params.CodeChallenge {
		chall, err = helpers.GenerateCodeChallenge()
		if err != nil {
			return nil, err
		}

		q.Add("code_challenge", chall.CodeChallenge)
		q.Add("code_challenge_method", chall.Method)
	}

	q.Add("response_type", "code")
	q.Add("client_id", u.ClientID)
	q.Add("redirect_uri", u.RedirectUri)

	if params.Prompt != nil {
		q.Add("prompt", *params.Prompt)
	}
	if params.State != nil {
		q.Add("state", *params.State)
	}

	url.RawQuery = q.Encode()

	return &AuthorizationURLBody{
		Url:           url.String(),
		CodeChallenge: chall,
	}, nil
}
