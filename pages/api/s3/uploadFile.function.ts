import { fileHandler } from "../../../src/utils/api/fileHandler";
import { defaultBehavior } from "../../../src/utils/api/composable";
import { bucket, uploadPayload } from "../../../src/services/bucket.service";

export default defaultBehavior(async function (req) {
  const { body, getFile } = await fileHandler<uploadPayload>(req);

  const file = await getFile();
  const data = await bucket.uploadFile({ ...body, file });

  return data;
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
