package unified

import (
	"encoding/json"
	"net/http"
	"net/url"
	"strings"
)

type AuthTokenParams struct {
	Code          string
	CodeChallenge *string
}

type AuthTokenBody struct {
	TokenType             string     `json:"token_type"`
	ExiresIn              int        `json:"expires_in"`
	AccessToken           string     `json:"access_token"`
	Scope                 string     `json:"scope"`
	RefreshToken          *string    `json:"refresh_token"`
	RefreshTokenExpiresIn *int       `json:"refresh_token_expires_in"`
	IdToken               *string    `json:"id_token"`
	Error                 maybeError `json:"error"`
}

func (u *Unified) ExchangeAuthToken(params AuthTokenParams) (*AuthTokenBody, *UnifiedError) {
	client := http.Client{}

	body := url.Values{
		"grant_type":   {"authorization_code"},
		"code":         {params.Code},
		"client_id":    {u.ClientID},
		"redirect_uri": {u.RedirectUri},
	}

	if u.ClientSecret != nil {
		body.Add("client_secret", *u.ClientSecret)
	}

	if u.ClientSecret == nil && params.CodeChallenge == nil {
		return nil, &UnifiedError{
			StatusCode: 400,
			Message:    "client_secret or code_challenge must be provided",
			From:       "local",
		}
	}

	if params.CodeChallenge != nil {
		body.Add("code_challenge", *params.CodeChallenge)
	}

	req, err := http.NewRequest("POST", "https://apis.rtrampox.com.br/unified/v1/oauth/token", strings.NewReader(body.Encode()))
	if err != nil {
		return nil, fromError(err)
	}

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Add("Accept", "application/json")

	var respBody AuthTokenBody

	resp, err := client.Do(req)
	if err != nil {
		return nil, fromError(err)
	}

	if err := json.NewDecoder(resp.Body).Decode(&respBody); err != nil {
		return nil, fromError(err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, &UnifiedError{
			StatusCode: resp.StatusCode,
			Message:    respBody.Error.Message,
			From:       "unified-api",
		}
	}

	return &respBody, nil
}
