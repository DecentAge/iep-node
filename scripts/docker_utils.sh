#!/bin/bash
set -eou pipefail

init_secret() {
	local secret_name="$1"
	if [[ -f "/run/secrets/${secret_name}" ]]; then
		echo "Initializing secret ${secret_name} from secret /run/secrets/${secret_name}"
		local secret_value=$(cat /run/secrets/${secret_name})
		
		if [[ -z "${secret_value}" ]]; then
			echo "The provided secret in /run/secrets/${secret_name} is empty. Therfore ignoring secret file."
		else
			export ${secret_name}="${secret_value}"
		fi		

	elif [[ -n ${secret_name:-} ]]; then
		echo "Initializing secret ${secret_name} from variable ${secret_name}"
	else
        echo >&2 "error: Variable ${secret_name} nor secret file /run/secrets/${secret_name} is set"
		exit 1		
	fi	
}

init_base64_secret() {
	local secret_name="$1"
	local secret_base64_name=${secret_name}_BASE64
	init_secret $secret_base64_name
	if [[ ! -z "${!secret_base64_name}" ]]; then
		export ${secret_name}="$(echo ${!secret_base64_name} | base64 -d)"
		unset secret_base64_name
	fi
}

remove_secret() {
	local secret_name="$1"
	unset ${secret_name}
}