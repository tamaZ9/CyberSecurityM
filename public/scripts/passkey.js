async function createPassKey() {
  const relyingPartyId = ''
  const relyingPartyName = ''
  const userId = ''
  const userName = ''
  const displayName = ''
  // Availability of `window.PublicKeyCredential` means WebAuthn is usable.
  if (window.PublicKeyCredential &&
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
    PublicKeyCredential.isConditionalMediationAvailable) {
    // Check if user verifying platform authenticator is available.
    Promise.all([
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
      PublicKeyCredential.isConditionalMediationAvailable,
    ]).then(async results => {
      if (results.every(r => r === true)) {
        const publicKeyCredentialCreationOptions = {
          challenge: new Uint8Array([0]),
          rp: {
            name: relyingPartyName,
            id: relyingPartyId,
          },
          user: {
            id: userId,
            name: userName,
            displayName: displayName,
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
          excludeCredentials: [{
            id: userid,
            type: 'public-key',
            transports: ['internal'],
          }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            requireResidentKey: true,
          },
          timeout: 30000
        };

        const credential = await navigator.credentials.create({
          publicKey: publicKeyCredentialCreationOptions
        });

        // Encode and send the credential to the server for verification.
      }
    });
  }
}