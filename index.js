const moment = require("moment");
const WebSocket = require("ws");

const main = async () => {
  const server = new WebSocket.Server({ port: 8383 });

  server.on("listening", () => {
    console.log(`WebSocket server is listening on port ${server.options.port}`);
  });

  server.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("message", async (message) => {
      // wait 4 seconds
      await new Promise((resolve) => setTimeout(resolve, 4000));

      // log the raw
      console.log("Received Kiosk message:");
      console.log(message);

      // log message data
      const messageData = JSON.parse(message);
      console.log("Kiosk message parsed:");
      console.log(messageData);

      // call init VNPay POS transaction
      // receive response from VNPay POS
      const VNPayResponse = {
        merchantCode: "VNPAY_TEST",
        merchantMethodCode: "VNPAY_TEST_P211207W00142_QRCODE",
        methodCode: "VNPAY_QRCODE",
        partnerCode: "VNPAY",
        orderCode: "86280849-b1c0-4c4a-b2d5-407a93f8079f",
        amount: Number(messageData.TransactionData.Amount),
        realAmount: Number(messageData.TransactionData.Amount),
        totalPaid: Number(messageData.TransactionData.Amount),
        transactionCode: messageData.TransactionData.Reference,
        clientTransactionCode: messageData.TransactionData.Reference,
        responseCode: "200",
        responseMessage: "Payment success",
        partnerTransactionCode: messageData.TransactionData.Reference,
        bankCode: "VNPAYEWALLET",
        bankAccountNo: "",
        installmentTerm: 0,
        cashierId: "",
        checksum:
          "f9aa7ff7e0c71a983193394622f9f6140302206a86caedfe290de6a0fbbaaed9",
      };

      const responseData = JSON.stringify({
        ResponseType: 1,
        Response: {
          ResponseAmount: `${VNPayResponse.amount}.00`,
          AuthorizationNumber: "545865",
          BankName: VNPayResponse.bankCode,
          CardCompanyName: "VNPAY",
          CardNumber: "xxxx-xxxx-xxxx-1234",
          ExpirationDate: "07/25",
          LastDigits: "1234",
          ClientVoucher:
            "@cnb Santander \n @cnn VENTA \n @br \n @cnn KIDZANIA GDL \n @cnn (0001) KIDZANIA GDL \n @cnn AVENIDA AMERICAS 1950 \n @cnn COL. PLAZA PATRIA, JAL \n @br \n @cnn 7889988 KIDZANIA GDL \n \n @br \n @lnn No.Tarjeta: xxxxxxxxxxxx{} \n @br \n @lnn CREDITO/BBVA BANCOMER/MasterCard \n @br \n @cnb -C-L-I-E-N-T-E- \n @lnn APROBADA \n \n \n @lnn IMPORTE\n @cnb $ 0.01 MXN \n @cnb Oper.: 676432318 \n @lnn Ref.: 451855ff-2abc- @lnn 4167-ae72-ce4f907eaac0\n @lnn ARQC: ***********58D8\n @lnn AID: 07A0000000041010 \n @cnb Aut.: 495602 \n \n \n \n @lnn \n @lnn Fecha: 03/04/2019 19:22:05 \n \n \n @br \n @cnn ME OBLIGO EN LOS TERMINOS DADOS\n @cnn AL REVERSO DE ESTE DOCUMENTO \n @br \n \n \n @bc 676432318 \n \n",
          FacilityVoucher:
            "@cnb Santander \n @cnn VENTA \n @br \n @cnn KIDZANIA GDL \n @cnn (0001) KIDZANIA GDL \n @cnn AVENIDA AMERICAS 1950 \n @cnn COL. PLAZA PATRIA, JAL \n @br \n @cnn 7889988 KIDZANIA GDL \n @cnn BU8ASIUS2 \n \n @br \n @lnn No.Tarjeta: xxxxxxxxxxxx7049 \n @lnn Vence:10/20 \n @br \n @lnn CREDITO/BBVA BANCOMER/MasterCard \n @cnb -C-O-M-E-R-C-I-O- \n @br \n @lnn APROBADA \n \n \n @lnn IMPORTE\n @cnb $ 0.01 MXN \n @cnb Oper.: 676432318 \n @lnn Ref.: 451855ff-2abc- @lnn 4167-ae72-ce4f907eaac0\n @lnn ARQC: ***********58D8\n @lnn AID: 07A0000000041010 \n @cnb Aut.: 495602 \n \n \n \n @lnn \n @lnn Fecha: 03/04/2019 19:22:05 \n \n @br \n @br \n @br \n @cnn \n @cnn VALIDADO CON FIRMA ELECTRONICA \n @br \n @cnn ME OBLIGO EN LOS TERMINOS DADOS\n @cnn AL REVERSO DE ESTE DOCUMENTO \n @br \n \n \n @bc 676432318 \n \n",
          // ClientVoucher: "ClientVoucher",
          // FacilityVoucher: "FacilityVoucher",
          ResponseDate: moment().format("DD/MM/YYYY"),
          ElectronicInvoiceRequired: false,
          OperationalNumber: `${Date.now()}`,
          ReferenceNumber: VNPayResponse.clientTransactionCode,
          ResponseTime: moment().format("HH:mm:ss"),
          CardType: "CREDITO",
          HolderName: "Stephen",
        },
        Errors: null,
      });

      console.log("Response to Kiosk:");
      console.log(responseData);

      // Emit a message back to the client
      socket.send(responseData);
    });

    socket.on("close", () => {
      console.log("Client disconnected");
    });
  });
};

main();
