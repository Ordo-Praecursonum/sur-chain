package types

// Event types for x/identity
const (
	EventTypeUsernameRegistered = "username_registered"
	EventTypeDeviceAdded        = "device_added"
	EventTypeDeviceRevoked      = "device_revoked"

	AttributeKeyUsername       = "username"
	AttributeKeyControlKeyHash = "control_key_hash"
)

// DefaultMaxDevicesPerUser is the default maximum number of active devices per user.
const DefaultMaxDevicesPerUser = uint64(10)
