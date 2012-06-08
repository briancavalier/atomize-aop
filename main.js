define({

	// Create a component instance
	component: {
		create: 'component',
		// Call doInTransaction after component has been wired
		ready: 'doInTransaction',
		// Brute force add some around advice to log the
		// value after a transaction completes
		around: {
			'doInTransaction': 'logAdvice'
		}
	},

	// Transactional Aspect for Atomize
	// Very brute-force setup right now.  This could be
	// made much more automatic
	transactionAspect: {
		create: {
			module: 'lib/transactionAspect',
			// Inject a reference to atomize itself
			args: { $ref: 'atomize!' }
		}
	},

	// Logging advice
	logAdvice: {
		create: {
			module: 'lib/logAdvice',
			// Inject a reference to the atomize root
			args: { $ref: 'atomize!:root' }
		}
	},

	// wire plugins
	plugins: [
		// Debug -- see the browser console
		{ module: 'wire/debug' },
		// Quick and dirty atomize plugin for wire that starts atomize
		// and provides access to an atomize instance and the shared root
		// via a wire reference resolver (see usage of "atomize!" above)
		{ module: 'lib/atomize-wire' },
		// Do some pointcut aop to add transaction support to the
		// doInTransaction method
		{
			module: 'wire/aop',
			aspects: [
				{
					pointcut: /doInTransaction/,
					advice: 'transactionAspect'
				}
			]
		}
	]
});