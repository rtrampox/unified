package unified

import (
	"encoding/json"
	"net/http"
)

type nilStr *string // nullable string helper type

type UserinfoBody struct {
	// openid
	Sub nilStr `json:"sub"`

	// profile
	Username   nilStr `json:"preffered_username"`
	GivenName  nilStr `json:"given_name"`
	FamilyName nilStr `json:"family_name"`
	Name       nilStr `json:"name"`
	Picture    nilStr `json:"picture"`

	// email
	Email         nilStr `json:"email"`
	EmailVerified *bool  `json:"email_verified"`

	// phone
	Phone         nilStr `json:"phone"`
	PhoneVerified *bool  `json:"phone_verified"`

	// offline_access
	UpdatedAt nilStr `json:"updated_at"`

	// default
	Locale nilStr     `json:"locale"`
	Scope  string     `json:"scope"`
	Error  maybeError `json:"error"`
}

func GetUserinfo(acToken string) (*UserinfoBody, *UnifiedError) {
	client := http.Client{}

	req, err := http.NewRequest("GET", "https://apis.rtrampox.com.br/unified/v1/userinfo", nil)
	if err != nil {
		return nil, fromError(err)
	}

	req.Header.Add("Authorization", "Bearer "+acToken)
	req.Header.Add("Accept", "application/json")

	var respBody UserinfoBody

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
