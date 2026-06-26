package types

import "fmt"

// NewParams creates a new Params instance.
func NewParams(maxDevicesPerUser uint64) Params {
	return Params{
		MaxDevicesPerUser: maxDevicesPerUser,
	}
}

// DefaultParams returns a default set of parameters.
func DefaultParams() Params {
	return NewParams(DefaultMaxDevicesPerUser)
}

// Validate validates the set of params.
func (p Params) Validate() error {
	if p.MaxDevicesPerUser == 0 {
		return fmt.Errorf("max_devices_per_user must be greater than 0")
	}
	return nil
}
