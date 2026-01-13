/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'

import * as challengeUtils from '../lib/challengeUtils'
import { challenges } from '../data/datacache'
import * as security from '../lib/insecurity'
import * as utils from '../lib/utils'

export function performRedirect() {
  return (_req: Request, res: Response, _next: NextFunction) => {
    // Always redirect to a safe, internal URL
    const safeUrl = '/dashboard' // or any internal route you control

    // Optionally trigger challenges if needed
    challengeUtils.solveIf(
      challenges.redirectCryptoCurrencyChallenge,
      () => false
    )
    challengeUtils.solveIf(
      challenges.redirectChallenge,
      () => false
    )

    // Redirect only to the safe, predefined URL
    res.redirect(safeUrl)
  }
}


function isUnintendedRedirect (toUrl: string) {
  let unintended = true
  for (const allowedUrl of security.redirectAllowlist) {
    unintended = unintended && !utils.startsWith(toUrl, allowedUrl)
  }
  return unintended
}
