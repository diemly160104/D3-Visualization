function drawChart1(container) {
    const margin = { top: 20, right: 50, bottom: 50, left: 200 },
          width = 1200 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    const svg = d3.select(container)
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select("body").append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0);

    d3.csv("data_ggsheet - data.csv").then(rawData => {
        rawData.forEach(d => {
            d["Thành tiền"] = +d["Thành tiền"];
            d["Số lượng bán"] = +d["Số lượng bán"];
        });

        const nestedData = d3.rollup(
            rawData,
            v => ({
                doanhThu: d3.sum(v, d => d["Thành tiền"]),
                soLuong: d3.sum(v, d => d["SL"]),
                maMatHang: v[0]["Mã mặt hàng"],
                maNhomHang: v[0]["Mã nhóm hàng"],
                nhomHang: v[0]["Tên nhóm hàng"]
            }),
            d => d["Tên mặt hàng"]
        );

        const data = Array.from(nestedData, ([tenMatHang, values]) => ({
            tenMatHang: `[${values.maMatHang}] ${tenMatHang}`,
            ...values
        }));

        data.sort((a, b) => b.doanhThu - a.doanhThu);

        const color = d3.scaleOrdinal()
                        .domain(data.map(d => d.maNhomHang))
                        .range(d3.schemeTableau10);

        const y = d3.scaleBand()
                    .domain(data.map(d => d.tenMatHang))
                    .range([0, height])
                    .padding(0.2);

        const x = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.doanhThu)])
                    .nice()
                    .range([0, width]);

        svg.append("g").call(d3.axisLeft(y));
        svg.append("g")
           .attr("transform", `translate(0, ${height})`)
           .call(d3.axisBottom(x)
                   .ticks(15)
                   .tickFormat(d3.format(".1s"))
                   .tickSizeOuter(0));

        svg.selectAll(".bar")
           .data(data)
           .enter()
           .append("rect")
           .attr("class", "bar")
           .attr("y", d => y(d.tenMatHang))
           .attr("x", 0)
           .attr("height", y.bandwidth())
           .attr("width", d => x(d.doanhThu))
           .attr("fill", d => color(d.maNhomHang))
           .on("mouseover", (event, d) => {
              tooltip.style("opacity", 1)
                     .html(`Mặt hàng: <strong>${d.tenMatHang}</strong><br>
                            Nhóm hàng: [${d.maNhomHang}] ${d.nhomHang}<br>
                            Doanh thu: ${d3.format(",.0f")(d.doanhThu / 1_000_000)} triệu VND<br>
                            Số lượng bán: ${d.soLuong} SKUs`)
                     .style("left", (event.pageX + 10) + "px")
                     .style("top", (event.pageY - 28) + "px");
           })
           .on("mousemove", (event) => {
              tooltip.style("left", (event.pageX + 10) + "px")
                     .style("top", (event.pageY - 28) + "px");
           })
           .on("mouseout", () => {
              tooltip.style("opacity", 0);
           });

        svg.selectAll(".label")
           .data(data)
           .enter()
           .append("text")
           .attr("x", d => x(d.doanhThu) + 5)
           .attr("y", d => y(d.tenMatHang) + y.bandwidth() / 2)
           .attr("dy", "0.35em")
           .attr("text-anchor", "start")
           .style("font-size", "12px")
           .text(d => `${d3.format(",.0f")(d.doanhThu / 1_000_000)} triệu VND`);

    }).catch(error => {
        console.error("Lỗi khi load file CSV:", error);
    });
}

function drawChart2(container) {
    const margin = {top: 20, right: 50, bottom: 50, left: 200},
          width = 1200 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    const svg = d3.select(container)
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select("#tooltip");

    d3.csv("data_ggsheet - data.csv").then(rawData => {
      rawData.forEach(d => {
        d["Thành tiền"] = +d["Thành tiền"];
        d["SL"] = +d["SL"];
      });

      const nestedData = d3.rollup(
        rawData,
        v => ({
          doanhThu: d3.sum(v, d => d["Thành tiền"]),
          soLuong: d3.sum(v, d => d["SL"]),
          maMatHang: v[0]["Mã mặt hàng"],
          maNhomHang: v[0]["Mã nhóm hàng"],
          tenNhomHang: v[0]["Tên nhóm hàng"]
        }),
        d => d["Tên nhóm hàng"]
      );

      const data = Array.from(nestedData, ([TenMatHang, values]) => ({
        TenMatHang,
        doanhThu: values.doanhThu,
        soLuong: values.soLuong,
        maMatHang: values.maMatHang,
        maNhomHang: values.maNhomHang,
        tenNhomHang: values.tenNhomHang
      }));

      data.sort((a, b) => b.doanhThu - a.doanhThu);

      const color = d3.scaleOrdinal()
                      .domain(data.map(d => d.maNhomHang))
                      .range(d3.schemeTableau10);

      const y = d3.scaleBand()
                  .domain(data.map(d => `[${d.maNhomHang}] ${d.tenNhomHang}`))
                  .range([0, height])
                  .padding(0.2);

      const x = d3.scaleLinear()
                  .domain([0, d3.max(data, d => d.doanhThu)])
                  .nice()
                  .range([0, width]);

      svg.append("g")
         .call(d3.axisLeft(y));

      svg.append("g")
         .attr("transform", `translate(0, ${height})`)
         .call(d3.axisBottom(x)
                 .ticks(22)
                 .tickFormat(d => (d/1000000) + "M")
                 .tickSizeOuter(0));

      svg.selectAll(".bar")
         .data(data)
         .enter()
         .append("rect")
         .attr("class", "bar")
         .attr("y", d => y(`[${d.maNhomHang}] ${d.tenNhomHang}`))
         .attr("x", 0)
         .attr("height", y.bandwidth())
         .attr("width", d => x(d.doanhThu))
         .attr("fill", d => color(d.maNhomHang))
         .on("mouseover", (event, d) => {
           tooltip.style("display", "block")
                  .html(`Nhóm hàng: <strong>[${d.maNhomHang}] ${d.tenNhomHang}</strong><br>
                         Doanh số bán: ${d3.format(",.0f")(d.doanhThu / 1_000_000)} triệu VND<br>
                         Số lượng bán: ${d.soLuong} SKUs`)
                  .style("left", `${event.pageX + 10}px`)
                  .style("top", `${event.pageY - 20}px`);
         })
         .on("mousemove", event => {
           tooltip.style("left", `${event.pageX + 10}px`)
                  .style("top", `${event.pageY - 20}px`);
         })
         .on("mouseout", () => {
           tooltip.style("display", "none");
         });

      const formatMillion = d3.format(",.0f");
      svg.selectAll(".label")
         .data(data)
         .enter()
         .append("text")
         .attr("x", d => x(d.doanhThu) + 5)
         .attr("y", d => y(`[${d.maNhomHang}] ${d.tenNhomHang}`) + y.bandwidth() / 2)
         .attr("dy", "0.35em")
         .attr("text-anchor", "start")
         .style('font-size','12px')
         .text(d => `${formatMillion(d.doanhThu/1_000_000)} triệu VND`);
    }).catch(error => {
      console.error("Lỗi khi load file CSV:", error);
    });
}

function drawChart3(container) {
    const margin = {top: 20, right: 5, bottom: 50, left: 200},
          width = 1300 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    const svg = d3.select(container)
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select("#tooltip");

    d3.csv("data_ggsheet - data.csv").then(rawData => {
      rawData.forEach(d => {
        d["Thành tiền"] = +d["Thành tiền"];
        d["SL"] = +d["SL"];
        d.Tháng = `Tháng ${d["Thời gian tạo đơn"].split("-")[1]}`;
      });

      const nestedData = d3.rollup(
        rawData,
        v => ({
          doanhThu: d3.sum(v, d => d["Thành tiền"]),
          soLuong: d3.sum(v, d => d["SL"])
        }),
        d => d.Tháng
      );

      const data = Array.from(nestedData, ([Tháng, {doanhThu, soLuong}]) => ({ Tháng, doanhThu, soLuong }));
      data.sort((a, b) => a.Tháng.localeCompare(b.Tháng, 'vi', { numeric: true }));

      const color = d3.scaleOrdinal(d3.schemeTableau10);

      const x = d3.scaleBand()
                  .domain(data.map(d => d.Tháng))
                  .range([0, width])
                  .padding(0.2);

      const y = d3.scaleLinear()
                  .domain([0, d3.max(data, d => d.doanhThu)])
                  .nice()
                  .range([height, 0]);

      svg.append("g")
         .attr("transform", `translate(0, ${height})`)
         .call(d3.axisBottom(x))
         .append("text")
         .attr("x", width / 2)
         .attr("y", 40)
         .attr("fill", "black")
         .attr("text-anchor", "middle");

      svg.append("g")
         .call(d3.axisLeft(y)
                 .ticks(9)
                 .tickFormat(d3.format(".1s"))
                 .tickSizeOuter(0));

      svg.selectAll(".bar")
         .data(data)
         .enter()
         .append("rect")
         .attr("class", "bar")
         .attr("x", d => x(d.Tháng))
         .attr("y", d => y(d.doanhThu))
         .attr("width", x.bandwidth())
         .attr("height", d => height - y(d.doanhThu))
         .attr("fill", d => color(d.Tháng))
         .on("mouseover", (event, d) => {
           tooltip.style("display", "block")
                  .html(`<strong>${d.Tháng}</strong><br>
                        Doanh số: ${d3.format(",.0f")(d.doanhThu / 1_000_000)} triệu VND <br>
                        Số lượng: ${d.soLuong} SKUs`)
                  .style("left", `${event.pageX + 10}px`)
                  .style("top", `${event.pageY - 20}px`);
         })
         .on("mousemove", event => {
           tooltip.style("left", `${event.pageX + 10}px`)
                  .style("top", `${event.pageY - 20}px`);
         })
         .on("mouseout", () => {
           tooltip.style("display", "none");
         });

      svg.selectAll(".label")
         .data(data)
         .enter()
         .append("text")
         .attr("x", d => x(d.Tháng) + x.bandwidth() / 2)
         .attr("y", d => y(d.doanhThu) - 5)
         .attr("text-anchor", "middle")
         .style('font-size','12px')
         .text(d => `${d3.format(",.0f")(d.doanhThu / 1_000_000)} triệu VND`);
    }).catch(error => {
      console.error("Lỗi khi load file CSV:", error);
    });
}

function drawChart4(container) {
    const margin = {top: 20, right: 50, bottom: 50, left: 200},
          width = 1300 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    const svg = d3.select(container)
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select("#tooltip");

    d3.csv("data_ggsheet - data.csv").then(rawData => {
      rawData.forEach(d => {
        d["Thành tiền"] = +d["Thành tiền"];
        d["Số lượng"] = +d["Số lượng"]; 
        d.Ngày = new Date(d["Thời gian tạo đơn"]).getDay(); 
      });

 
      const weekdays = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];
      const weekdayOrder = {1: "Thứ Hai", 2: "Thứ Ba", 3: "Thứ Tư", 4: "Thứ Năm", 5: "Thứ Sáu", 6: "Thứ Bảy", 0: "Chủ Nhật"};

      const groupedData = d3.group(rawData, d => d.Ngày);

      const data = Array.from(groupedData, ([ngay, orders]) => {
        const doanhThuTong = d3.sum(orders, d => d["Thành tiền"]);
        const soLuongTong = d3.sum(orders, d => d["SL"]); 
        const soNgayCoDon = new Set(orders.map(d => d["Thời gian tạo đơn"].split(" ")[0])).size; 

        const doanhThuTB = soNgayCoDon > 0 ? doanhThuTong / soNgayCoDon : 0;
        const soLuongTB = soNgayCoDon > 0 ? soLuongTong / soNgayCoDon : 0;

        return { Ngày: weekdayOrder[ngay], doanhThuTB, soLuongTB };
      });

      data.sort((a, b) => weekdays.indexOf(a.Ngày) - weekdays.indexOf(b.Ngày));

      const color = d3.scaleOrdinal(d3.schemeTableau10);

      const x = d3.scaleBand()
                  .domain(data.map(d => d.Ngày))
                  .range([0, width])
                  .padding(0.2);

      const y = d3.scaleLinear()
                  .domain([0, d3.max(data, d => d.doanhThuTB)])
                  .nice()
                  .range([height, 0]);

      svg.append("g")
         .attr("transform", `translate(0, ${height})`)
         .call(d3.axisBottom(x))
         .append("text")
         .attr("x", width / 2)
         .attr("y", 40)
         .attr("fill", "black");

      svg.append("g")
         .call(d3.axisLeft(y)
                 .ticks(10)
                 .tickFormat(d3.format(".1s"))
                 .tickSizeOuter(0));

      svg.selectAll(".bar")
         .data(data)
         .enter()
         .append("rect")
         .attr("class", "bar")
         .attr("x", d => x(d.Ngày))
         .attr("y", d => y(d.doanhThuTB))
         .attr("width", x.bandwidth())
         .attr("height", d => height - y(d.doanhThuTB))
         .attr("fill", d => color(d.Ngày))
         .on("mouseover", (event, d) => {
           tooltip.style("display", "block")
                  .html(`<strong>${d.Ngày}</strong><br>
                         Doanh thu TB: ${d3.format(",.0f")(d.doanhThuTB )} VND<br>
                         Số lượng TB: ${d3.format(",.0f")(d.soLuongTB)} SKUs`)
                  .style("left", `${event.pageX + 10}px`)
                  .style("top", `${event.pageY - 20}px`);
         })
         .on("mousemove", event => {
           tooltip.style("left", `${event.pageX + 10}px`)
                  .style("top", `${event.pageY - 20}px`);
         })
         .on("mouseout", () => {
           tooltip.style("display", "none");
         });

      svg.selectAll(".label")
         .data(data)
         .enter()
         .append("text")
         .attr("x", d => x(d.Ngày) + x.bandwidth() / 2)
         .attr("y", d => y(d.doanhThuTB) - 5)
         .attr("text-anchor", "middle")
         .style('font-size','12px')
         .text(d => `${d3.format(",.0f")(d.doanhThuTB )} VND`);
    }).catch(error => {
      console.error("Lỗi khi load file CSV:", error);
    });
}

function drawChart5(container) {
    const margin = {top: 30, right: 30, bottom: 50, left: 100},
          width = 1400 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    const svg = d3.select(container)
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select("body")
                      .append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0);

    d3.csv("data_ggsheet - data.csv").then(rawData => {

      rawData.forEach(d => {
        d["Thành tiền"] = +d["Thành tiền"];
        d["SL"] = +d["SL"];
        d["Thời gian tạo đơn"] = new Date(d["Thời gian tạo đơn"]);
        d["Ngày"] = d["Thời gian tạo đơn"].getDate();
        d["Tháng"] = d["Thời gian tạo đơn"].getMonth() + 1;
      });

      const nestedData = d3.rollups(
        rawData,
        v => {
          const doanhThuTong = d3.sum(v, d => d["Thành tiền"]);
          const skuTong = d3.sum(v, d => d["SL"]);
          const uniqueDates = d3.rollup(v, g => 1, d => `${d["Ngày"]}-${d["Tháng"]}`);
          const soNgayXuatHien = uniqueDates.size;

          return {
            doanhThuTrungBinh: doanhThuTong / soNgayXuatHien,
            skuTrungBinh: skuTong / soNgayXuatHien,
            tongDoanhThu: doanhThuTong,
            tongSL: skuTong,
            soNgay: soNgayXuatHien
          };
        },
        d => d["Ngày"]
      );

      const data = nestedData.map(([ngay, values]) => ({
        ngay: ngay,
        doanhThuTrungBinh: values.doanhThuTrungBinh,
        skuTrungBinh: values.skuTrungBinh,
        tongDoanhThu: values.tongDoanhThu,
        tongSL: values.tongSL,
        soNgay: values.soNgay
      }));

      data.sort((a, b) => a.ngay - b.ngay);

      const x = d3.scaleBand()
                  .domain(data.map(d => d.ngay))
                  .range([0, width])
                  .padding(0.2);

      const y = d3.scaleLinear()
                  .domain([0, d3.max(data, d => d.doanhThuTrungBinh)])
                  .nice()
                  .range([height, 0]);

      const color = d3.scaleOrdinal()
                      .domain(data.map(d => d.ngay))
                      .range(d3.schemePaired);

      svg.append("g")
         .attr("transform", `translate(0, ${height})`)
         .call(d3.axisBottom(x).tickFormat(d => `Ngày ${String(d).padStart(2, '0')}`))
         .selectAll("text")
         .attr("transform", "rotate(-45)")
         .style("text-anchor", "end");

      svg.append("g")
         .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${(d / 1_000_000).toFixed(0)} tr`));

      svg.selectAll(".bar")
         .data(data)
         .enter()
         .append("rect")
         .attr("class", "bar")
         .attr("x", d => x(d.ngay))
         .attr("y", d => y(d.doanhThuTrungBinh))
         .attr("width", x.bandwidth())
         .attr("height", d => height - y(d.doanhThuTrungBinh))
         .attr("fill", d => color(d.ngay))
         .on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`
              <strong>Ngày${d.ngay}</strong><br/>
              Doanh thu TB: ${(d.doanhThuTrungBinh / 1_000_000).toFixed(0)} triệu VND<br/>
              Số lượng bán TB: ${d.skuTrungBinh.toFixed(0)} SKUs<br/>
            `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
         })
         .on("mouseout", () => {
            tooltip.transition().duration(500).style("opacity", 0);
         });

      svg.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d.ngay) + x.bandwidth() / 2)
        .attr("y", d => y(d.doanhThuTrungBinh) - 5)
        .attr("text-anchor", "middle")
        .style("fill", "black")
        .style("font-size", "12px")
        .text(d => `${(d.doanhThuTrungBinh / 1_000_000).toFixed(1)} tr`);

    }).catch(error => {
      console.error("Lỗi khi load file CSV:", error);
    });
}

function drawChart6(container) {
    const margin = {top: 60, right: 20, bottom: 80, left: 50},
          width = 1500 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    const svg = d3.select(container)
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select("#tooltip");

    d3.csv("data_ggsheet - data.csv").then(rawData => {
      rawData.forEach(d => {
        d["Thành tiền"] = +d["Thành tiền"];
        d["Số lượng"] = +d["Số lượng"];
        let date = new Date(d["Thời gian tạo đơn"]);
        if (!isNaN(date.getTime())) {
          d.Tháng = date.getMonth() + 1;
          d.Giờ = date.getHours();
          d.Ngày = date.toISOString().split('T')[0];
        }
      });

      const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00-${i.toString().padStart(2, '0')}:59`);
      
      const filteredData = rawData.filter(d => d.Giờ >= 8 && d.Giờ <= 23);
      const groupedData = d3.group(filteredData, d => d.Giờ);
      
      const data = [];
      groupedData.forEach((orders, hour) => {
        const uniqueDays = new Set(orders.map(d => d.Ngày)).size;
        const doanhThuTB = uniqueDays > 0 ? d3.sum(orders, d => d["Thành tiền"]) / uniqueDays : 0;
        const soLuongTB = uniqueDays > 0 ? d3.sum(orders, d => d["SL"]) : 0; 
        data.push({ KhungGiờ: timeSlots[hour], doanhThuTB, soLuongTB, Giờ: hour });
      });

      const x = d3.scaleBand()
                  .domain(timeSlots.slice(8, 24))
                  .range([0, width])
                  .padding(0.2);

      const y = d3.scaleLinear()
                  .domain([0, d3.max(data, d => d.doanhThuTB)])
                  .nice()
                  .range([height, 0]);

      const color = d3.scaleOrdinal(d3.schemeTableau10);

      svg.append("g")
         .attr("transform", `translate(0, ${height})`)
         .call(d3.axisBottom(x).tickSize(0))
         .selectAll("text")
         .attr("transform", "rotate(-45)")
         .style("text-anchor", "end");

      svg.append("g")
         .call(d3.axisLeft(y)
                 .ticks(10)
                 .tickFormat(d3.format(".1s"))
                 .tickSizeOuter(0));

      svg.selectAll(".bar")
         .data(data)
         .enter()
         .append("rect")
         .attr("class", "bar")
         .attr("x", d => x(d.KhungGiờ))
         .attr("y", d => y(d.doanhThuTB))
         .attr("width", x.bandwidth())
         .attr("height", d => height - y(d.doanhThuTB))
         .attr("fill", d => color(d.Giờ))
         .on("mouseover", (event, d) => {
           tooltip.style("display", "block")
                  .html(`Khung Giờ: ${d.KhungGiờ}<br>
                         Doanh thu TB: ${d3.format(",.0f")(d.doanhThuTB)} VND<br>
                         Số lượng TB: ${d3.format(",.0f")(d.soLuongTB)} SKUs`)
                  .style("left", `${event.pageX + 10}px`)
                  .style("top", `${event.pageY - 20}px`);
         })
         .on("mousemove", event => {
           tooltip.style("left", `${event.pageX + 10}px`)
                  .style("top", `${event.pageY - 20}px`);
         })
         .on("mouseout", () => {
           tooltip.style("display", "none");
         });

      svg.selectAll(".label")
         .data(data)
         .enter()
         .append("text")
         .attr("class", "label")
         .attr("x", d => x(d.KhungGiờ) + x.bandwidth() / 2)
         .attr("y", d => y(d.doanhThuTB) - 5)
         .style ('font-size','10')
         .text(d => d3.format(",.0f")(d.doanhThuTB) + " VND");
    }).catch(error => {
      console.error("Lỗi khi load file CSV:", error);
    });
}

function drawChart7(container) {
    const margin = {top: 30, right: 70, bottom: 20, left: 200},
          width = 1400 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    const svg = d3.select(container)
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select(".tooltip");

    d3.csv("data_ggsheet - data.csv").then(rawData => {
      const totalOrders = new Set(rawData.map(d => d["Mã đơn hàng"])).size;
      const nestedData = d3.rollup(
        rawData,
        v => ({ count: new Set(v.map(d => d["Mã đơn hàng"])).size, total: v.length }),
        d => d["Mã nhóm hàng"],
        d => d["Tên nhóm hàng"]
      );

      let data = [];
      nestedData.forEach((tenNhom, maNhom) => {
        tenNhom.forEach((stats, tenNhomHang) => {
          data.push({
            MaNhomHang: maNhom,
            Tennhomhang: tenNhomHang,
            probability: stats.count / totalOrders,
            totalOrders: stats.total
          });
        });
      });

      data.sort((a, b) => b.probability - a.probability);
      data.forEach(d => d.label = `[${d.MaNhomHang}] ${d.Tennhomhang}`);

      const color = d3.scaleOrdinal()
                      .domain(data.map(d => d.Tennhomhang))
                      .range(d3.schemeTableau10);

      const y = d3.scaleBand()
                  .domain(data.map(d => d.label))
                  .range([0, height])
                  .padding(0.2);

      const x = d3.scaleLinear()
                  .domain([0, d3.max(data, d => d.probability)])
                  .nice()
                  .range([0, width]);

      svg.append("g").call(d3.axisLeft(y));
      svg.append("g")
         .attr("transform", `translate(0, ${height})`)
         .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format(".0%")));

      svg.selectAll(".bar")
         .data(data)
         .enter()
         .append("rect")
         .attr("class", "bar")
         .attr("y", d => y(d.label))
         .attr("x", 0)
         .attr("height", y.bandwidth())
         .attr("width", d => x(d.probability))
         .attr("fill", d => color(d.Tennhomhang))
         .on("mouseover", function(event, d) {
            tooltip.style("display", "block")
                   .html(`<strong>${d.label}</strong><br>
                          <strong>Xác suất bán:</strong> ${d3.format(".1%")(d.probability)}<br>
                          <strong>SL đơn bán:</strong> ${d.totalOrders}`);
            d3.select(this).style("opacity", 0.7);
         })
         .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY - 20) + "px");
         })
         .on("mouseout", function() {
            tooltip.style("display", "none");
            d3.select(this).style("opacity", 1);
         });

      svg.selectAll(".label")
         .data(data)
         .enter()
         .append("text")
         .attr("x", d => x(d.probability) + 5)
         .attr("y", d => y(d.label) + y.bandwidth() / 2)
         .attr("dy", "0.35em")
         .attr("text-anchor", "start")
         .text(d => d3.format(".1%")(d.probability));

    }).catch(error => {
      console.error("Lỗi khi load file CSV:", error);
    });
}

function drawChart8(container) {
    const margin = { top: 50, right: 200, bottom: 50, left: 200},
              width = 1300 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

        const svg = d3.select(container)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);


        d3.csv("data_ggsheet - data.csv").then(rawData => {
            const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

            rawData.forEach(d => {
                d["Thời gian tạo đơn"] = parseDate(d["Thời gian tạo đơn"]);
                d["Tháng"] = d["Thời gian tạo đơn"].getMonth() + 1;
                d["Mã đơn hàng"] = d["Mã đơn hàng"].trim();
                d["Nhóm gộp"] = `[${d["Mã nhóm hàng"]}] ${d["Tên nhóm hàng"]}`;
            });

            const groupByMonthGroup = d3.rollups(
                rawData,
                v => new Set(v.map(d => d["Mã đơn hàng"])).size,
                d => d["Tháng"],
                d => d["Nhóm gộp"]
            );

            const totalDistinctOrdersByMonth = d3.rollups(
                rawData,
                v => new Set(v.map(d => d["Mã đơn hàng"])).size,
                d => d["Tháng"]
            );

            const totalOrdersByMonthObj = {};
            totalDistinctOrdersByMonth.forEach(([month, count]) => {
                totalOrdersByMonthObj[month] = count;
            });


            const data = [];

            groupByMonthGroup.forEach(([month, groups]) => {
                const totalInMonth = totalOrdersByMonthObj[month];

                groups.forEach(([groupName, groupCount]) => {
                    const probability = groupCount / totalInMonth;

                    data.push({
                        month: +month,
                        group: groupName,
                        probability: probability
                    });
                });
            });

            const x = d3.scaleLinear()
                .domain(d3.extent(data, d => d.month))
                .range([0, width]);

            const y = d3.scaleLinear()
                .domain([0, 1])
                .range([height, 0]);

            const color = d3.scaleOrdinal(d3.schemeTableau10);

            const dataGroup = d3.groups(data, d => d.group);

            const line = d3.line()
                .x(d => x(d.month))
                .y(d => y(d.probability));

            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).ticks(12).tickFormat(d => `Tháng ${d}`));

            svg.append("g")
                .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));


            svg.selectAll(".line")
                .data(dataGroup)
                .join("path")
                .attr("fill", "none")
                .attr("stroke", d => color(d[0]))
                .attr("stroke-width", 2)
                .attr("d", d => line(d[1]));


            const legend = svg.selectAll(".legend")
                .data(dataGroup)
                .join("g")
                .attr("transform", (d, i) => `translate(${width + 20},${i * 20})`);

            legend.append("rect")
                .attr("x", 0)
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", d => color(d[0]));

            legend.append("text")
                .attr("x", 15)
                .attr("y", 10)
                .text(d => d[0]);

            const tooltip = d3.select("body").append("div")
                .style("position", "absolute")
                .style("background", "#fff")
                .style("padding", "8px")
                .style("border", "1px solid #ccc")
                .style("border-radius", "4px")
                .style("pointer-events", "none")
                .style("opacity", 0);

            svg.selectAll(".dot")
                .data(data)
                .join("circle")
                .attr("cx", d => x(d.month))
                .attr("cy", d => y(d.probability))
                .attr("r", 4)
                .attr("fill", d => color(d.group))
                .on("mouseover", (event, d) => {
                    tooltip.transition().duration(200).style("opacity", 1);
                    tooltip.html(`
                        <strong>Tháng:</strong> ${d.month}<br/>
                        <strong>Nhóm hàng:</strong> ${d.group}<br/>
                        <strong>Xác suất:</strong> ${(d.probability * 100).toFixed(2)}%
                    `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", () => {
                    tooltip.transition().duration(500).style("opacity", 0);
                });

        }).catch(error => {
            console.error("Lỗi load dữ liệu:", error);
        });
}

function drawChart9(container) {
    const margin = { top: 40, right: 150, bottom: 60, left: 80 },
        width = 450 - margin.left - margin.right,
        height = 280 - margin.top - margin.bottom;

    const tooltip = d3.select(".tooltip");

    d3.csv("data_ggsheet - data.csv").then(rawData => {
        const nestedData = d3.rollup(
            rawData,
            v => {
                const uniqueOrders = new Set(v.map(m => m["Mã đơn hàng"])).size;
                const itemCounts = d3.rollup(v,
                    g => new Set(g.map(m => m["Mã đơn hàng"])).size,
                    m => `[${m["Mã mặt hàng"]}] ${m["Tên mặt hàng"]}`
                );
                const items = Array.from(itemCounts).map(([key, value]) => ({
                    MatHang: key,
                    totalOrders: value,
                    probability: value / uniqueOrders
                }));
                items.sort((a, b) => b.probability - a.probability);
                return items;
            },
            d => `[${d["Mã nhóm hàng"]}] ${d["Tên nhóm hàng"]}`
        );

        // 🟢 Tạo một khung chứa tất cả biểu đồ
        const mainContainer = d3.select(container)
            .append("div")
            .attr("class", "chart9-container")
            .style("border", "2px solid #ccc")
            .style("border-radius", "10px")
            .style("padding", "15px")
            .style("box-shadow", "3px 3px 10px rgba(0,0,0,0.1)")
            .style("background", "#fff")
            .style("max-width", "1400px")
            .style("margin", "auto");

        // 🟢 Thêm tiêu đề chung cho tất cả biểu đồ
        mainContainer.append("div")
            .attr("class", "chart-main-title")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .style("text-align", "center")
            .style("margin-bottom", "20px")
            .text("Biểu đồ Xác Suất Bán Hàng Theo Nhóm Hàng");

        // 🟢 Tạo một div để chứa tất cả biểu đồ nhỏ (gộp chung)
        const chartContainer = mainContainer.append("div")
            .attr("class", "charts-wrapper")
            .style("display", "grid")
            .style("grid-template-columns", "repeat(3, 1fr)")
            .style("gap", "20px")
            .style("justify-content", "center");

        let chartIndex = 1;
        nestedData.forEach((items, tenNhomHang) => {
            if (chartIndex > 6) return; 

            // 🟢 Tạo div nhỏ chứa mỗi biểu đồ nhưng KHÔNG có viền riêng
            const chartDiv = chartContainer.append("div")
                .attr("class", `chart-item chart-${chartIndex}`);

            chartDiv.append("div")
                .attr("class", "chart-title")
                .style("font-size", "16px")
                .style("font-weight", "bold")
                .style("text-align", "center")
                .style("margin-bottom", "10px")
                .text(tenNhomHang);

            const longestLabelLength = d3.max(items, d => d.MatHang.length);
            const adjustedLeftMargin = Math.max(120, longestLabelLength * 7);
            const adjustedWidth = width + (adjustedLeftMargin - margin.left);

            const svg = chartDiv.append("svg")
                .attr("width", adjustedWidth + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${adjustedLeftMargin},${margin.top})`);

            const color = d3.scaleOrdinal()
                .domain(items.map(d => d.MatHang))
                .range(d3.schemeTableau10);

            const y = d3.scaleBand()
                .domain(items.map(d => d.MatHang))
                .range([0, height])
                .padding(0.2);

            const x = d3.scaleLinear()
                .domain([0, d3.max(items, d => d.probability)]).nice()
                .range([0, width]);

            svg.append("g")
                .call(d3.axisLeft(y))
                .selectAll("text")
                .style("font-size", longestLabelLength > 20 ? "10px" : "12px")
                .style("text-anchor", "end");

            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format(".0%")));

            svg.selectAll(".bar")
                .data(items)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("y", d => y(d.MatHang))
                .attr("x", 0)
                .attr("height", y.bandwidth())
                .attr("width", d => x(d.probability))
                .attr("fill", d => color(d.MatHang))
                .on("mouseover", function (event, d) {
                    tooltip.style("display", "block")
                        .html(`Mặt hàng: <strong>${d.MatHang}</strong><br>
                               Nhóm hàng: ${tenNhomHang}<br>
                               SL Đơn Bán: ${d3.format(",")(d.totalOrders)}<br>
                               Xác suất bán/Nhóm hàng: ${d3.format(".1%")(d.probability)}`);
                    d3.select(this).style("opacity", 0.7);
                })
                .on("mousemove", function (event) {
                    tooltip.style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 20) + "px");
                })
                .on("mouseout", function () {
                    tooltip.style("display", "none");
                    d3.select(this).style("opacity", 1);
                });

            svg.selectAll(".label")
                .data(items)
                .enter()
                .append("text")
                .attr("class", "label")
                .attr("x", d => x(d.probability) + 5)
                .attr("y", d => y(d.MatHang) + y.bandwidth() / 2 + 5)
                .text(d => d3.format(".1%")(d.probability))
                .style("font-size", "12px")
                .style("fill", "black");

            chartIndex++;
        });
    }).catch(error => {
        console.error("Lỗi khi load file CSV:", error);
    });
}



function drawChart10(container) {
    const margin = { top: 50, right: 50, bottom: 50, left: 60 },
          width = 350 - margin.left - margin.right,
          height = 250 - margin.top - margin.bottom;

    const tooltip = d3.select("#tooltip");

    d3.csv("data_ggsheet - data.csv").then(rawData => {
        const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
        rawData.forEach(d => {
            d["Thời gian tạo đơn"] = parseDate(d["Thời gian tạo đơn"]);
            d["Tháng"] = d["Thời gian tạo đơn"].getMonth() + 1;
            d["Nhóm gộp"] = `[${d["Mã nhóm hàng"]}] ${d["Tên nhóm hàng"]}`;
            d["Mặt hàng gộp"] = `[${d["Mã mặt hàng"]}] ${d["Tên mặt hàng"]}`;
        });

        const groupByMonthGroupItem = d3.rollups(
            rawData,
            v => ({ count: new Set(v.map(d => d["Mã đơn hàng"])).size }),
            d => d["Tháng"],
            d => d["Nhóm gộp"],
            d => d["Mặt hàng gộp"]
        );

        const groupByMonthGroup = d3.rollups(
            rawData,
            v => new Set(v.map(d => d["Mã đơn hàng"])).size,
            d => d["Tháng"],
            d => d["Nhóm gộp"]
        );

        const totalOrdersByGroupMonthObj = {};
        groupByMonthGroup.forEach(([month, groups]) => {
            groups.forEach(([group, count]) => {
                totalOrdersByGroupMonthObj[`${month}-${group}`] = count;
            });
        });

        const data = [];
        groupByMonthGroupItem.forEach(([month, groups]) => {
            groups.forEach(([groupName, items]) => {
                const totalInGroupMonth = totalOrdersByGroupMonthObj[`${month}-${groupName}`] || 1;
                items.forEach(([itemName, itemData]) => {
                    data.push({
                        month: +month,
                        group: groupName,
                        item: itemName,
                        count: itemData.count,
                        probability: itemData.count / totalInGroupMonth
                    });
                });
            });
        });

        const dataGroup = d3.groups(data, d => d.group);

        // Tạo một `div` duy nhất để chứa tất cả biểu đồ
        const chartContainer = d3.select(container)
            .append("div")
            .attr("class", "chart-container")
            .style("display", "grid")
            .style("grid-template-columns", "repeat(3, 1fr)")
            .style("gap", "20px")
            .style("padding", "10px")
            .style("border", "2px solid #ccc")
            .style("border-radius", "10px")
            .style("box-shadow", "0 4px 8px rgba(0,0,0,0.1)");

        // Vẽ tất cả biểu đồ trong `div` chung này
        dataGroup.forEach(([groupName, groupData]) => {
            const svg = chartContainer.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -20)
                .attr("text-anchor", "middle")
                .style("font-size", "14px")
                .style("font-weight", "bold")
                .text(groupName);

            const x = d3.scaleLinear()
                .domain(d3.extent(groupData, d => d.month))
                .range([0, width]);

            const y = d3.scaleLinear()
                .domain([0, d3.max(groupData, d => d.probability)])
                .range([height, 0]);

            const color = d3.scaleOrdinal(d3.schemeTableau10);
            const itemsGroup = d3.groups(groupData, d => d.item);

            const line = d3.line()
                .x(d => x(d.month))
                .y(d => y(d.probability));

            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).ticks(12).tickFormat(d => `T${String(d).padStart(2, '0')}`));

            svg.append("g")
                .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

            itemsGroup.forEach(([itemName, itemData]) => {
                svg.append("path")
                    .datum(itemData)
                    .attr("fill", "none")
                    .attr("stroke", color(itemName))
                    .attr("stroke-width", 2)
                    .attr("d", line);

                svg.selectAll(".dot")
                    .data(itemData)
                    .enter()
                    .append("circle")
                    .attr("cx", d => x(d.month))
                    .attr("cy", d => y(d.probability))
                    .attr("r", 5)
                    .attr("fill", color(itemName))
                    .on("mouseover", (event, d) => {
                        tooltip.style("opacity", 1)
                            .html(`
                                <strong>T${String(d.month).padStart(2, '0')}</strong>
                                | <strong>Mặt hàng: ${d.item}</strong><br>
                                Nhóm hàng: ${d.group} | SL Đơn Bán: ${d.count}<br>
                                Xác suất Bán / Nhóm hàng: ${(d.probability * 100).toFixed(2)}%
                            `)
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 10) + "px");
                    })
                    .on("mouseout", () => {
                        tooltip.style("opacity", 0);
                    });
            });
        });
    }).catch(error => {
        console.error("Lỗi load dữ liệu:", error);
    });
}

function drawChart11(container) {
    const margin = { top: 50, right: 50, bottom: 50, left: 60 },
              width = 1200 - margin.left - margin.right,
              height = 600 - margin.top - margin.bottom;

        const svg = d3.select(container)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip");

        d3.csv("data_ggsheet - data.csv").then(rawData => {
            const purchasesByCustomer = d3.rollups(
                rawData,
                v => new Set(v.map(d => d["Mã đơn hàng"])).size,
                d => d["Mã khách hàng"]
            );

            const distribution = d3.rollups(
                purchasesByCustomer,
                v => v.length,
                d => d[1] 
            );

            const data = distribution.map(([purchaseCount, customerCount]) => ({
                purchaseCount: +purchaseCount,
                customerCount: +customerCount
            })).sort((a, b) => a.purchaseCount - b.purchaseCount);

            console.log("Phân phối lượt mua hàng:", data);
          
            const x = d3.scaleBand()
                .domain(data.map(d => d.purchaseCount))
                .range([0, width])
                .padding(0.1);

            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.customerCount)])
                .nice()
                .range([height, 0]);
     
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).tickFormat(d3.format("d")))
                .selectAll("text")
                .style("font-size", "12px");
          
            svg.append("g")
                .call(d3.axisLeft(y))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", -margin.left + 10)
                .attr("fill", "black")
                .attr("text-anchor", "middle")
                .text("Số Khách Hàng");
          
            svg.selectAll(".bar")
                .data(data)
                .join("rect")
                .attr("class", "bar")
                .attr("x", d => x(d.purchaseCount))
                .attr("y", d => y(d.customerCount))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d.customerCount))
                .attr("fill", "#4e79a7")
                .on("mouseover", (event, d) => {
                    tooltip.transition().duration(200).style("opacity", 1);
                    tooltip.html(`
                        <strong>Đã mua ${d.purchaseCount} lần</strong><br/>
                        Số lượng KH: ${d3.format(",")(d.customerCount)}
                    `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", () => {
                    tooltip.transition().duration(500).style("opacity", 0);
                });
        }).catch(error => {
            console.error("Lỗi load dữ liệu:", error);
        });
}

function drawChart12(container) {
    const margin = { top: 50, right: 50, bottom: 100, left: 80 },
              width = 1600 - margin.left - margin.right,
              height = 600 - margin.top - margin.bottom;

        const svg = d3.select(container)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip");


        d3.csv("data_ggsheet - data.csv").then(rawData => {
            rawData.forEach(d => {
                d["Thành tiền"] = +d["Thành tiền"];
            });

            const spendingByCustomer = d3.rollups(
                rawData,
                v => d3.sum(v, d => d["Thành tiền"]),
                d => d["Mã khách hàng"]
            );

            const formatNumber = d3.format(",");
            const binSize = 50000;

            const binsMap = new Map();

            spendingByCustomer.forEach(([customerId, totalSpend]) => {
                const binIndex = Math.floor(totalSpend / binSize);
                const lowerBound = binIndex * 50000;
                const upperBound = lowerBound + 50000;
                const binLabel = `${upperBound / 1000}K`;

                const lowerFormatted = formatNumber(lowerBound);
                const upperFormatted = formatNumber(upperBound);
                const tooltipLabel = `${lowerFormatted} đến ${upperFormatted}`;

                if (!binsMap.has(binLabel)) {
                    binsMap.set(binLabel, { count: 0, tooltip: tooltipLabel, lower: lowerBound, upper: upperBound });
                }

                const binData = binsMap.get(binLabel);
                binData.count += 1;
            });

            const data = Array.from(binsMap, ([label, { count, tooltip, lower, upper }]) => ({
                label,
                count,
                tooltip,
                lower,
                upper
            })).sort((a, b) => a.lower - b.lower);

            console.log("Phân phối mức chi trả:", data);

            const x = d3.scaleBand()
                .domain(data.map(d => d.label))
                .range([0, width])
                .padding(0.1);

            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.count)])
                .nice()
                .range([height, 0]);

            svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x)
                .tickFormat((d, i) => {
                    return (i % 2 === 0) ? d : "";
                })
            )
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-0.8em")
            .attr("dy", "-0.15em")
            .attr("transform", "rotate(-90)")
            .style("font-size", "12px");


            svg.append("g")
                .call(d3.axisLeft(y))
                .selectAll("text")
                .style("font-size", "12px");

            svg.selectAll(".bar")
                .data(data)
                .join("rect")
                .attr("class", "bar")
                .attr("x", d => x(d.label))
                .attr("y", d => y(d.count))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d.count))
                .attr("fill", "#4e79a7")
                .on("mouseover", (event, d) => {
                    tooltip.transition().duration(200).style("opacity", 1);
                    const lowerFormatted = d.lower.toLocaleString('vi-VN');
                    const upperFormatted = d.upper.toLocaleString('vi-VN');
                    tooltip.html(`
                        <strong>Đã chỉ tiêu Từ ${lowerFormatted} đến ${upperFormatted}</strong><br/>
                        Số lượng KH: ${d.count.toLocaleString('vi-VN')}
                    `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", () => {
                    tooltip.transition().duration(500).style("opacity", 0);
                });

        }).catch(error => {
            console.error("Lỗi load dữ liệu:", error);
        });
}
