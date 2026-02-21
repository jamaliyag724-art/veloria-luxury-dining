<main className="relative z-10 pt-40 pb-40">
  <div className="max-w-7xl mx-auto px-6">

    {/* HEADER */}
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.7 }}
      className="text-center mb-28"
    >
      <span className="text-yellow-400 tracking-[0.4em] text-xs uppercase">
        Get in Touch
      </span>

      <h1 className="font-serif text-6xl md:text-7xl mt-6 mb-6 text-white leading-tight">
        Speak With Our Concierge
      </h1>

      <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-6" />

      <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
        For reservations, private events, or general inquiries,
        our team is delighted to assist you.
      </p>
    </motion.div>

    {/* MAIN GRID */}
    <div className="grid lg:grid-cols-2 gap-24 items-start">

      {/* FORM SIDE */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-transparent blur-2xl opacity-30 rounded-3xl" />
        <div className="relative bg-white/5 backdrop-blur-2xl border border-yellow-400/20 rounded-[32px] p-14 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
          <ContactForm />
        </div>
      </motion.div>

      {/* INFO SIDE */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.7, delay: 0.2 }}
        className="space-y-16"
      >

        {/* INFO CARDS */}
        <div className="grid sm:grid-cols-2 gap-8">
          {contactDetails.map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -8 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transition-all hover:border-yellow-400/40 hover:shadow-[0_20px_60px_rgba(250,204,21,0.1)]"
            >
              <div className="flex gap-5">
                <div className="w-14 h-14 bg-yellow-400/10 rounded-full flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-white text-lg">
                    {item.title}
                  </h3>
                  {item.lines.map((line, i) => (
                    <p key={i} className="text-sm text-zinc-400 leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* MAP */}
        <div className="overflow-hidden h-[450px] rounded-[32px] border border-yellow-400/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 pointer-events-none" />
          <span className="absolute top-5 left-5 z-20 bg-black/60 backdrop-blur px-5 py-2 rounded-full text-xs text-yellow-400 border border-yellow-400/30">
            Our Location
          </span>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18..."
            width="100%"
            height="100%"
            loading="lazy"
            className="grayscale contrast-125"
          />
        </div>

        {/* EVENT CARD */}
        <div className="bg-gradient-to-br from-yellow-400/10 to-transparent border border-yellow-400/30 p-10 rounded-[32px] backdrop-blur-xl">
          <h3 className="font-serif text-2xl mb-4 text-white">
            Planning a Private Event?
          </h3>

          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
            Our elegant dining space is perfect for celebrations,
            anniversaries and corporate gatherings.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="btn-gold text-sm px-8 py-3"
          >
            Inquire About Events
          </motion.button>
        </div>

      </motion.div>
    </div>
  </div>
</main>
