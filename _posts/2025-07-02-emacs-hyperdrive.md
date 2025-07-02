---
title: Emacs - hyperdrive
date: 2025-07-02
categories: emacs, notes, hyperdrive
tags:
  - emacs
  - notes
  - hyperdrive
---

# Emacs - hyperdrive

**Last Updated: 02nd July 2025**

While I was looking into past EmacsConf talks (just to explore Emacs...), I found this talk about [https://emacsconf.org/2023/talks/hyperdrive/](hyperdrive.el: Peer-to-peer filesystem in Emacs) in EmacsConf 2023, where [Prot](https://protesilaos.com/) and Joseph explained about this "decentralized drive" and how to use it from Emacs. This seemed to be a nice way to share files without any third party online services and also embraces privacy too (We can even stream audio/video too !). So I just want to give it a try and explore this and so I'm going to share what I've done so far.

So I followed the manual to install it. There are two parts to it. One to install `hyperdrive.el` from NonGNU ELPA and after that install the `gateway (hyperdrive-gateway-ushin)` that helps in connecting with the network.

After the installation and using the default config, when I tried to start the gateway, I wasn't able to and had following error, `Error running timer: (hyperdrive-error "Gateway failed to start (see #<buffer  *hyperdrive-start*> for errors)")` in my Emacs 30.1. This persisted even if I installed the gateway manually as per manual.

I tried searching the web but coudn't find a way to solve this (I think my searching skills aren't good enough...), so I asked Joseph in XMPP chat room and he asked me to show the error that is being thrown out when run directly in commandline based on which we found that the gateway binaries being distributed has a [*dependecy issue*](https://github.com/fastify/fastify-secure-session/issues/260) with cryptography library `libsodium` and a [packaging problem](https://github.com/holepunchto/sodium-native/pull/224).

So then I tried building the gateway myself from source and then it worked i.e. when I start the gateway directly but not through Emacs and then Joseph pointed me to set these two path variables: `hyperdrive-gateway-program` &  `hyperdrive-gateway-directory` and then it worked from Emacs itself and was able to access Prot and USHIN's hyperdrives.

Still I get this error message when I access other's drives: `Error running timer ‘plz--respond’: (void-variable node)` but able to access them.

In future, I plan to use this hyperdrive, whenever I want to share some large files or misc which I can't share or post through my blog. Here's the link to my public hyperdrive:

`hyper://3y3fx1k4ifbw6uw7wzxhzkm5azp5gkbet53r6tc7a5qzsxeabeoo`

Next, I wanted to delve into some more for e.g. on latest features like [peer graph, org-transclution, etc](https://emacsconf.org/2024/talks/hyperdrive/) and it seems that we can also use it from [mobile](https://github.com/AgregoreWeb/agregore-mobile) as well. Also explore how this hyperdrive works in contrast to IPFS and Torrent. I will update those here when I complete them. Thanks for reading. Share me your thought about me or my blog to any of my social media handles.

**PS:** I also learnt about this keybinding `C-x C-j (dired-jump)` which opens the dired buffer of current file's directory !. More Emacs explorations to come... :)
