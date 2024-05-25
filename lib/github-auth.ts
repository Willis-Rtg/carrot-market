export async function getAccessToken(code: string) {
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  };
  const formattedParmas = new URLSearchParams(params).toString();
  const accessTokenUrl = `https://github.com/login/oauth/access_token?${formattedParmas}`;
  const { error, access_token } = await (
    await fetch(accessTokenUrl, {
      method: "post",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if (error) {
    return new Response(null, { status: 400 });
  }
  return access_token;
}

interface TUserProfile {
  id: number;
  login: string;
  email: string;
  avatar_url: string;
}

export async function getUserProfile(
  access_token: string
): Promise<TUserProfile> {
  const userProfileResponse = await fetch("https://api.github.com/user", {
    method: "get",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });
  return await userProfileResponse.json();
}
