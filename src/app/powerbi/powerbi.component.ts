import { Component, OnInit , ViewChild,ElementRef } from '@angular/core';
import * as pbi from 'powerbi-client';
import { environment } from "src/environments/environment"

@Component({
  selector: 'app-powerbi',
  templateUrl: './powerbi.component.html',
  styleUrls: ['./powerbi.component.scss']
})
export class PowerbiComponent implements OnInit {


  report: pbi.Embed;
@ViewChild('reportContainer') reportContainer: ElementRef;
  constructor() { }

  ngOnInit(): void {
    // setTimeout(()=>{
    //   this.showReport('H4sIAAAAAAAEAB2Wtc7GDJaD7-Vvs1KYVpoi9IaZ04WZOaO99_1meje2j57jf_9jpe8wp8U___uPifGLPhOifzdClmgpTc7nBTsvILHVVYZZgu-j7yyFL83HLC1IJ5xsmvBRAlh1HCTSzxTO9nxQfc_vVpl7Fs96McemyltRFHkiFlYPHyJ0_vguDqy-vABuaVvcxMToH1S6ihAavIANzC4TOYcHvUIPCT7rvx_abE7JLZSloazULX1jVykPMJaP89fHmsK91K964YEDeTBjE98CZFEYu9p70tcdKoS30NZd3OTqEenLnb5Saf2SqUU4ma3ko2JD9nG1ydZXjuKaKSxtOTgEdNDyeDq3pBp8Pc6RPJuKJ12VCvoxDsyRmTaK6ow2yN6t5a84MZwPqY7vn30gEjRDFLNRl6uAFCb7IgLH6GeIUWKXU12E5baPCm0xuD1gwmtxggELt4pRZljRXVkt0jWiyaVK9lLNzgdinXYxrmn82PfqsWbf_1xWJ5nQpU73ZWMA_3gmtpAPbnOhgM_ISMlVkQrDr-AjQwLm4QkbTMy5xeGUn24-4B8e8Qe1uFdfsRandqIKMgLr3tXuLYTtlcDGvSl7LCe1zbrva4pXf9Uyfy6NdUbwMmhBG7tUPV5c-22ZT1yoP8_edqXQG6YNCyXiZEJvMhMgieWFJn6S00QHGxBrg1MIuA8F9t2e1UJoqJqUzlZK2lwVIv8ij6GjQltFMpnpxvQkpp0_ZGJJ_nsTvo9bZnYiyLAsD75jdGdH38s75TAdvAAImFisJNhlzn9vtTkQ0-WL53M0v3iXIpDYQUqQ3Ej9-gg1sh42U2Wwtu1k4g2kcdNLQ8pCzHFydKwvHqkQbkaQkpbyK_4SdRDVYd-HpZMDo-aiuUVvmFs1sy0PTFgcdXFYCr39HwHDZ7bfurQmSWqfh8HWs9WMhVaB9GND3XOaAcfAoNa6Yk0oTp6uzvau3u7K40K-KJpaNL0AgS1RXQBIatiqi1oSydA0YFCJ4UyLTJkyvdlJnzQHEd4WTrvVTK46kHNlaSaIKAHIs58uPpBKgfoE7tcrPRlEmJarxjgu8BO2LWT4Wj4kOT_zpBQWCPMhOtOQv3Zk0KVsRXXC55yNklkBA6aH_f68cZ39OOK2IbpX5DvHuAMlFkhElx6cSocF2vwBSENARJw4eg_M9e3RogcVpdIPsd-IBLw-OmqVsVsVvdW8FvkgeLQn_k7SRSAbfWIxDSH0LXEK_Vie4eGhH01oks4yoBNrxBfRIPZsqPbfsq4QE5BXblS1nt-ox5UQ3y_lGBfHzUabA_P3vbMaoS4uIP3mwS0AUuq-cpmf4Tk2p9kUs-D42X1z8MV3D_eacxNv-IJijh3xLzK_NgoymrSizit1Xk6qtpPEfN5I3Ei6hSbT4D31kcWTJV6IG2hj2jpSZ5TUDDGzak6fU2Tw3-pvRbSLvjVjDbpdieCUPezQD-w_K6hJyHW0TAhTgguPpT_imquOnhvNsplXymY9gyo30wV3D6MJpQjRxa_WryJXYI3QePcLk9Zu31fLRgocskttzSAmNHHYKdNrvO9sAgqDNCsIcrh9zapFxkzk9VafjXhfnR8CGAn5MSq-PqtyZUxpCrHIH89mdx7Lnt8eVzdZI789C_oviF_MM48oEl2VRmjIvVxuw6SLbrvC6Pn70TT12aFvqZ0fewLidVZwtdu1eSTBVgs8QB9n0moiFvrIIqR5Or3IWQtnc3LvXDXmjAUGwjMM-58ybvLC9E2ZKUI9JJEuPfBlDTiHhBq4EV-bowfb3ksRlE6EQjVPQZ7OVH9ggb8v9ag1wdjNpz8EEiO2CodO9EuIC2snzoiE17ymB70dUSPWDoB7NdiyxwGiCqMtrJSRx8RafBhyU4Q1jabLHT0NA3L2KFyRXzfasjyQS8YP6_PnArDIBQMRgEUlSbVglIXONnLVHDwvXtbi46JGgXteEfnUKb-QkcMdYtly_c-5S8gF1zBd6BYbfds7mnisxCWS1zzW8ZG4ikbCQzGGCq722s2QzxQ_xA-9PqWA51hbhqCDtZHXy3MyYeUMrWMS1dK4nKOtP8DOJaQQ4UdLQxvJFYn52ja8tN3RmSkIqowWVcOFE7quT_XuoSNQ1sPrimQGCT1yi09sjMayWzQG-gxap9GoA4XqOggIwH46yZTkh9l-bK4T8Dwzy_nqTCKZ2iQMP37z-v2Pw2EVAZ9e8tJCSv2jMywgXLvtztnoM3-ozQYADaJxBRWVaezxL6HEh2l8PH3p69QTD1dJNaeBVFa70S4HeiNj8ExnDtbvvG1n9MPqNCyqOfhPyZT9JkZ4bqmBn1tevyPFn6YX6PbJEA2-jY8PgETMbwaMj9y3c8iWGBe05WBdO_TMrmxpGJJLGtYgmslA04nX0-cW40Pg742gJ11lTfhGECbm3-X8xGSWUs0_XJLmzr8rvrVLElNpCvisR_ZBzNx-THj0D7L5si6Ae49bt-wTDgvGkGn3v_75n3-47V2OWS3fv-klIuesYH8jxNrQ_Z47-SO6Hsiy2Cq-8Flgcqpl4_3lJEOykfMauogjyFpuk69KkdqLl-pUsqUHqnppzDyxFE5zGNMIP_DnLM7AeKdywWUL79d1smAPZr9Skp1JoHJgCuFriEfP2SiMvWnmCbIUc2-ZOGOh5l9YSLI8jpjAf1uq4wZKTbSk0AGlUhT3Bm8YbW6KTP-WFggN9Y9u5-1miyFXm5LeWwnRGvOvwLmYQUWk5e6sh-wQuU45RdiYH-pbsa5NbrG8BarRIdveinHnsbBJKT-xMfluoAORoj3Fu8wGC7keKoS-Fn_C8H70caclb8l0zZTG5T3moO0TBSCnwAT9Yrv-139jfpem3OTgL-XCcT-BUHbgfKtdiGbv7NX8_q_KbespPc6t_JPFGjTeVZHkdGbXKh9jF6pPGTpRm1d5cKxjIpgCjL7XPRzaiZy7cVVfgYZgdRPbLz-yRv-mPZdfk_zqv8Vdt50G0YvZ8BA6VfpFQsrXQCYIriNmnl9FFFnOttUItaeYyABuG7ce9tJe1n08sxKkaN7k0dkaRioH0MYFgYtmkNIa6c7Er5XAafl0-WlGASLUbdRKUMRiYo-twcNSjH-IsRI65eooR1sWHrdze2RqRdb7LaakY4SgYkC_vFyC5iVxdChc0g3rQNdzqKMGaHokcmx_OjZVn0hetU_8gBtfhkn7b_SuU06OPXr0mMyNDk_yDNQoK5DIU_LrWVrLf_kAC9Q3d_8p4__-H4PEZkpuDAAA.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7Im1vZGVybkVtYmVkIjpmYWxzZX19')

    // } , 1000) 
  }
  showReport(Token) {
    // Embed URL    
    let embedUrl = environment.powerBI.reportBaseURL;
    let embedReportId = environment.powerBI.reportID;
  let settings: pbi.IEmbedSettings = {
      filterPaneEnabled: false,
      navContentPaneEnabled: false,
    };
  let config: pbi.IEmbedConfiguration = {
      type: 'report',
      tokenType: pbi.models.TokenType.Embed,
      accessToken: Token.token,
      embedUrl: embedUrl,
      id: embedReportId,
      filters: [],
      settings: settings
    };
  let reportContainer = this.reportContainer.nativeElement;
    let powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);
    this.report = powerbi.embed(reportContainer, config);
    this.report.off("loaded");
  this.report.on("loaded", () => {
      console.log("Loaded");
      // this.setTokenExpirationListener(Token.expiration, 2);
    });
  this.report.on("error", () => {
      console.log("Error");
    });
  }

}
