module.exports = {
	instrument: {
		command: "istanbul instrument --output _test/instrumented src/classes"
	},
	report: {
		command: "istanbul report --root _test/tmp/coverage/from_browsers --dir coverage lcov"
	},
	options: {
		stdout: true,
		failOnError: true
	}
}
