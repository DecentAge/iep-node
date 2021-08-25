#!/bin/bash
set -eou pipefail

init_secret() {
	local secret_name="$1"
	if [[ -f "/run/secrets/${secret_name}" ]]; then
		echo "Initializing secret ${secret_name} from secret /run/secrets/${secret_name}"
		local secret_value=$(cat /run/secrets/${secret_name})
		export ${secret_name}=${secret_value}
	elif [[ -n ${secret_name:-} ]]; then
		echo "Initializing secret ${secret_name} from variable ${secret_name}"
	else
        echo >&2 "error: both ${secret_name} and /run/secrets/${secret_name} are not set"
		exit 1		
	fi	
}

init_base64_secret() {
	local secret_name="$1"
	local secret_base64_name=${secret_name}_BASE64
	init_secret $secret_base64_name
	export ${secret_name}=$(echo ${!secret_base64_name} | base64 -d)
	unset secret_base64_name
}

remove_secret() {
	local secret_name="$1"
	unset ${secret_name}
}