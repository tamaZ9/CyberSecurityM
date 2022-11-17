
async function createPassKey() {
  const relyingPartyId = '192.168.1.8'
  const relyingPartyName = '192.168.1.8'
  const userId = new ArrayBuffer(8)
  const userName = document.getElementById('username')
  const displayName = document.getElementById('username')
  // Availability of `window.PublicKeyCredential` means WebAuthn is usable.
  if (true /*window.PublicKeyCredential &&
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
    PublicKeyCredential.isConditionalMediationAvailable*/) {
    // Check if user verifying platform authenticator is available.
    Promise.all([
      /*PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
      PublicKeyCredential.isConditionalMediationAvailable(),
    */]).then(async results => {
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
            id: userId,
            type: 'public-key',
            transports: ['internal'],
          }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            requireResidentKey: true,
          },
          timeout: 30000
        };

        let credentialContainer = window.navigator
        credentialContainer.credentials.create({
          publicKey: publicKeyCredentialCreationOptions
        }).then(console.log('evviva'));

        // Encode and send the credential to the server for verification.
      }
    });
  } else { // Passkeys not supported
    console.log('not supported')
  }
}