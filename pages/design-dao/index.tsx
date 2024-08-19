import Head from 'next/head';

export default function Events() {
  const html =
    '<h1>Feeding America: A Lifeline for Millions</h1>\n<p>Feeding America is a prominent non-profit organization based in the United States, committed to combating hunger through a robust network of over 200 food banks. Serving as a vital resource, it ensures that more than 46 million individuals access the nourishment they need via food pantries, soup kitchens, shelters, and other community-based agencies.</p>\n<p>As the largest U.S. charity by revenue, according to Forbes, Feeding America\'s extensive reach and impactful initiatives play a crucial role in alleviating food insecurity across the nation. Its dedication to providing food assistance has made a significant difference in the lives of many, fostering hope and support within communities.</p>\n<img src="https://aqua-dull-locust-679.mypinata.cloud/ipfs/bafybeigw3om3v6zt3jsrxpdikbocgihruumzl4vml3r6jlqpe56hu6yosq?pinataGatewayToken=v8BV9VKQs69NLLcVsQaw_fd_pcihpitKGBGpB13WTx40K9pHydzCcywsW0F1yAeL" alt="Feeding America Logo" />';
  return (
    <>
      <Head>
        <title>DAOnation - Design DAO</title>
        <meta name="description" content="DAOnation - Events" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center flex-col gap-8">
        <div className="gap-8 flex flex-col w-full bg-gohan pt-10 pb-6 border-beerus border">
          <div className="container flex w-full justify-between">
            <div className="flex flex-col gap-1 overflow-hidden text-center w-full">
              <h1 className="text-moon-32 font-bold">All events</h1>
              <h3 className="text-trunks">Here you can find all ongoing charity events</h3>
            </div>
          </div>
        </div>
        <div className="container flex flex-col gap-8 items-center">
          <div dangerouslySetInnerHTML={{ __html: html }}></div>
        </div>
      </div>
    </>
  );
}
