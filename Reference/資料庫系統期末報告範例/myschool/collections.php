<!doctype html>
<html lang="en">
    <head>
        <style>
    body {
        background-color: #f2f6fa;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .page-title {
        text-align: center;
        font-size: 36px;
        font-weight: 600;
        color: #0d6efd;
        margin-top: 30px;
        margin-bottom: 30px;
    }

    #example_wrapper {
        background-color: #ffffff;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    table.dataTable thead th {
        background-color: #e9ecef;
        color: #495057;
        font-weight: 600;
    }

    table.dataTable tbody td {
        text-align: center;
        vertical-align: middle;
    }

    table.dataTable tbody tr:hover {
        background-color: #f1f3f5;
    }

    table.dataTable tfoot th {
        background-color: #e9ecef;
    }

    .dataTables_length,
    .dataTables_filter,
    .dataTables_info,
    .dataTables_paginate {
        margin-top: 15px;
    }
</style>
        
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>e-Search</title>
        <!-- 使用bootstrap模板美化，如果你想用原生css，就把下面的link刪掉 -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
        <!-- 有使用到少量Jquery -->
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
        <!-- 載入dataTables 套件 (多功能Table) -->
        <link href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css" rel=stylesheet>
        <script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
        <!-- 使用axios與php傳遞資料 -->
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    </head>
    <body>
        <!-- 這是最上方導覽列 -->
        <?php include('navbar.html')  ?>
        <table border="1" class="dataframe">
  <thead>
        <!DOCTYPE html>
    <html lang="zh-Hant">
    <head>
    <meta charset="UTF-8">
    <title>再製多層合併表頭範例</title>
    <style>
        table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        }
        th, td {
        border: 1px solid #000;
        padding: 4px;
        font-size: 14px;
        }
        thead th {
        background: #f0f0f0;
        }
        .group {
        background: #ddd;
        font-weight: bold;
        }
        .note {
        text-align: left;
        border: none;
        padding: 8px;
        font-style: italic;
        }
    </style>
    </head>
    <body>

    <table>
    <thead>
        <!-- 第一層表頭：主標題群組 -->
    <tr>
        <th rowspan="3">期間<br>Period</th>
        <th rowspan="3">合計<br><hr style="border: 1px solid;">Total<br>千度(MWh)</th>
        <th colspan="2">慣常水力<br>Hydro</th>
        <th colspan="2">地熱<br>Geothermal</th>
        <th colspan="2">太陽光電<br>Solar PV</th>
        <th colspan="6">風力<br>Wind</th>
        <th colspan="6">生質能<br>Biomass</th>
        <th colspan="2">廢棄物<br>Waste</th>
        <th rowspan="3">Period</th>
    </tr>
        <!-- 第二層表頭：單位與占比 -->
        <tr>
        <th rowspan="2">千度(MWh)</th>
        <th rowspan="2">占比(%)</th>
        <th rowspan="2">千度(MWh)</th>
        <th rowspan="2">占比(%)</th>
        <th rowspan="2">千度(MWh)</th>
        <th rowspan="2">占比(%)</th>
        <th colspan="2">小計<br>Subtotal</th>
        <th colspan="2">陸域<br>Onshore</th>
        <th colspan="2">離岸<br>Offshore</th>
        <th colspan="2">小計<br>Subtotal</th>
        <th colspan="2">固態<br>Solid</th>
        <th colspan="2">氣態<br>Biogas</th>
        <th rowspan="2">千度(MWh)</th>
        <th rowspan="2">占比(%)</th>
    </tr>
        <!-- 第三層表頭：單位與占比 -->
        <tr>
            <th>千度(MWh)</th><th>占比(%)</th>
            <th>千度(MWh)</th><th>占比(%)</th>
            <th>千度(MWh)</th><th>占比(%)</th>
            <th>千度(MWh)</th><th>占比(%)</th>
            <th>千度(MWh)</th><th>占比(%)</th>
            <th>千度(MWh)</th><th>占比(%)</th>
        </tr>
    </thead>
<tbody>
        <tr>
            <td>95年</td>
            <td>7,743,848</td>
            <td>4,088,351</td>
            <td>52.8</td>
            <td>0</td>
            <td>0</td>
            <td>1,457</td>
            <td>0.0</td>
            <td>276,075</td>
            <td>3.6</td>
            <td>276,075</td>
            <td>3.6</td>
            <td>0</td>
            <td>0</td>
            <td>321,292</td>
            <td>4.1</td>
            <td>266,849</td>
            <td>3.4</td>
            <td>54,442</td>
            <td>0.7</td>
            <td>3,056,674</td>
            <td>39.5</td>
            <td>2006</td>
        </tr>
        <tr>
            <td>96年</td>
            <td>8,324,812</td>
            <td>4,417,550</td>
            <td>53.1</td>
            <td>0</td>
            <td>0</td>
            <td>2,180</td>
            <td>0.0</td>
            <td>439,534</td>
            <td>5.3</td>
            <td>439,534</td>
            <td>5.3</td>
            <td>0</td>
            <td>0</td>
            <td>302,267</td>
            <td>3.6</td>
            <td>246,865</td>
            <td>3.0</td>
            <td>55,402</td>
            <td>0.7</td>
            <td>3,163,280</td>
            <td>38.0</td>
            <td>2007</td>
        </tr>
        <tr>
            <td>97年</td>
            <td>8,259,060</td>
            <td>4,305,105</td>
            <td>52.1</td>
            <td>0</td>
            <td>0</td>
            <td>4,473</td>
            <td>0.1</td>
            <td>588,265</td>
            <td>7.1</td>
            <td>588,265</td>
            <td>7.1</td>
            <td>0</td>
            <td>0</td>
            <td>272,489</td>
            <td>3.3</td>
            <td>226,997</td>
            <td>2.7</td>
            <td>45,491</td>
            <td>0.6</td>
            <td>3,088,727</td>
            <td>37.4</td>
            <td>2008</td>
        </tr>
        <tr>
            <td>98年</td>
            <td>7,809,525</td>
            <td>3,748,288</td>
            <td>48.0</td>
            <td>0</td>
            <td>0</td>
            <td>9,113</td>
            <td>0.1</td>
            <td>786,635</td>
            <td>10.1</td>
            <td>786,635</td>
            <td>10.1</td>
            <td>0</td>
            <td>0</td>
            <td>229,350</td>
            <td>2.9</td>
            <td>187,521</td>
            <td>2.4</td>
            <td>41,829</td>
            <td>0.5</td>
            <td>3,036,139</td>
            <td>38.9</td>
            <td>2009</td>
        </tr>
    <tr>
        <td>99年</td>
        <td>8,639,758</td>
        <td>4,194,101</td>
        <td>48.5</td>
        <td>0</td>
        <td>0</td>
        <td>21,727</td>
        <td>0.3</td>
        <td>1,026,338</td>
        <td>11.9</td>
        <td>1,026,338</td>
        <td>11.9</td>
        <td>0</td>
        <td>0</td>
        <td>270,038</td>
        <td>3.1</td>
        <td>234,679</td>
        <td>2.7</td>
        <td>35,359</td>
        <td>0.4</td>
        <td>3,127,554</td>
        <td>36.2</td>
        <td>2010</td>
    </tr>
    <tr>
        <td>100年</td>
        <td>8,987,061</td>
        <td>3,999,726</td>
        <td>44.5</td>
        <td>0</td>
        <td>0</td>
        <td>61,623</td>
        <td>0.7</td>
        <td>1,492,677</td>
        <td>16.6</td>
        <td>1,492,677</td>
        <td>16.6</td>
        <td>0</td>
        <td>0</td>
        <td>236,091</td>
        <td>2.6</td>
        <td>209,739</td>
        <td>2.3</td>
        <td>26,352</td>
        <td>0.3</td>
        <td>3,196,944</td>
        <td>35.6</td>
        <td>2011</td>
    </tr>
        <tr>
            <td>101年</td>
            <td>1,066,271</td>
            <td>5,669,558</td>
            <td>53.2</td>
            <td>0</td>
            <td>0</td>
            <td>159,869</td>
            <td>1.5</td>
            <td>1,413,468</td>
            <td>13.3</td>
            <td>1,413,468</td>
            <td>13.3</td>
            <td>0</td>
            <td>0</td>
            <td>242,070</td>
            <td>2.3</td>
            <td>218,577</td>
            <td>2.0</td>
            <td>23,493</td>
            <td>0.2</td>
            <td>3,177,741</td>
            <td>29.8</td>
            <td>2012</td>
        </tr>
        <tr>
            <td>102年</td>
            <td>1,085,815</td>
            <td>5,422,890</td>
            <td>49.9</td>
            <td>0</td>
            <td>0</td>
            <td>321,096</td>
            <td>3.0</td>
            <td>1,640,008</td>
            <td>15.1</td>
            <td>1,640,008</td>
            <td>15.1</td>
            <td>0</td>
            <td>0</td>
            <td>228,481</td>
            <td>2.1</td>
            <td>205,350</td>
            <td>1.9</td>
            <td>23,131</td>
            <td>0.2</td>
            <td>3,245,672</td>
            <td>29.9</td>
            <td>2013</td>
        </tr>
        <tr>
            <td>103年</td>
            <td>9,925,066</td>
            <td>4,317,862</td>
            <td>43.5</td>
            <td>0</td>
            <td>0</td>
            <td>528,762</td>
            <td>5.3</td>
            <td>1,500,484</td>
            <td>15.1</td>
            <td>1,500,484</td>
            <td>15.1</td>
            <td>0</td>
            <td>0</td>
            <td>252,468</td>
            <td>2.5</td>
            <td>231,913</td>
            <td>2.3</td>
            <td>20,554</td>
            <td>0.2</td>
            <td>3,325,490</td>
            <td>33.5</td>
            <td>2014</td>
        </tr>
        <tr>
            <td>104年</td>
            <td>1,047,883</td>
            <td>4,470,146</td>
            <td>42.7</td>
            <td>0</td>
            <td>0</td>
            <td>850,267</td>
            <td>8.1</td>
            <td>1,525,236</td>
            <td>14.6</td>
            <td>1,525,236</td>
            <td>14.6</td>
            <td>0</td>
            <td>0</td>
            <td>248,991</td>
            <td>2.4</td>
            <td>227,420</td>
            <td>2.2</td>
            <td>21,571</td>
            <td>0.2</td>
            <td>3,384,192</td>
            <td>32.2</td>
            <td>2015</td>
        </tr>
        <tr>
            <td>105年</td>
            <td>1,273,275</td>
            <td>6,562,041</td>
            <td>51.5</td>
            <td>0</td>
            <td>0</td>
            <td>1,109,005</td>
            <td>8.7</td>
            <td>1,457,102</td>
            <td>11.4</td>
            <td>1,457,102</td>
            <td>11.4</td>
            <td>0</td>
            <td>0</td>
            <td>208,056</td>
            <td>1.6</td>
            <td>185,762</td>
            <td>1.5</td>
            <td>22,294</td>
            <td>0.2</td>
            <td>3,396,552</td>
            <td>26.7</td>
            <td>2016</td>
        </tr>
        <tr>
            <td>106年</td>
            <td>1,236,931</td>
            <td>5,446,815</td>
            <td>44.0</td>
            <td>0</td>
            <td>0</td>
            <td>1,667,453</td>
            <td>13.5</td>
            <td>1,722,459</td>
            <td>13.9</td>
            <td>1,702,077</td>
            <td>13.8</td>
            <td>20,381</td>
            <td>0.2</td>
            <td>191,585</td>
            <td>1.5</td>
            <td>169,450</td>
            <td>1.4</td>
            <td>22,135</td>
            <td>0.2</td>
            <td>3,341,001</td>
            <td>27.0</td>
            <td>2017</td>
        </tr>
        <tr>
            <td>107年</td>
            <td>1,265,304</td>
            <td>4,481,645</td>
            <td>35.4</td>
            <td>1</td>
            <td>0.0</td>
            <td>2,703,658</td>
            <td>21.4</td>
            <td>1,709,487</td>
            <td>13.5</td>
            <td>1,682,777</td>
            <td>13.3</td>
            <td>26,710</td>
            <td>0.2</td>
            <td>191,649</td>
            <td>1.5</td>
            <td>166,440</td>
            <td>1.3</td>
            <td>25,209</td>
            <td>0.2</td>
            <td>3,566,597</td>
            <td>28.2</td>
            <td>2018</td>
        </tr>
        <tr>
            <td>108年</td>
            <td>1,526,620</td>
            <td>5,544,796</td>
            <td>36.3</td>
            <td>757</td>
            <td>0.0</td>
            <td>4,017,031</td>
            <td>26.3</td>
            <td>1,892,232</td>
            <td>12.4</td>
            <td>1,715,855</td>
            <td>11.2</td>
            <td>176,377</td>
            <td>1.2</td>
            <td>176,521</td>
            <td>1.2</td>
            <td>151,434</td>
            <td>1</td>
            <td>25,087</td>
            <td>0.2</td>
            <td>3,634,861</td>
            <td>23.8</td>
            <td>2019</td>
        </tr>
        <tr>
            <td>109年</td>
            <td>1,518,611</td>
            <td>3,019,152</td>
            <td>19.9</td>
            <td>1,912</td>
            <td>0.0</td>
            <td>6,074,674</td>
            <td>40.0</td>
            <td>2,308,872</td>
            <td>15.2</td>
            <td>1,792,791</td>
            <td>11.8</td>
            <td>516,080</td>
            <td>3.4</td>
            <td>211,754</td>
            <td>1.4</td>
            <td>141,366</td>
            <td>0.9</td>
            <td>70,388</td>
            <td>0.5</td>
            <td>3,569,744</td>
            <td>23.5</td>
            <td>2020</td>
        </tr>
        <tr>
            <td>110年</td>
            <td>1,753,093</td>
            <td>3,474,663</td>
            <td>19.8</td>
            <td>9,074</td>
            <td>0.1</td>
            <td>7,970,191</td>
            <td>45.5</td>
            <td>2,270,784</td>
            <td>13.0</td>
            <td>1,701,480</td>
            <td>9.7</td>
            <td>569,304</td>
            <td>3.2</td>
            <td>201,707</td>
            <td>1.2</td>
            <td>153,172</td>
            <td>0.9</td>
            <td>48,535</td>
            <td>0.3</td>
            <td>3,604,514</td>
            <td>20.6</td>
            <td>2021</td>
        </tr>
        <tr>
            <td>111年</td>
            <td>2,388,540</td>
            <td>5,836,503</td>
            <td>24.4</td>
            <td>25,008</td>
            <td>0.1</td>
            <td>10,676,988</td>
            <td>44.7</td>
            <td>3,577,476</td>
            <td>15.0</td>
            <td>2,082,798</td>
            <td>8.7</td>
            <td>1,494,678</td>
            <td>6.3</td>
            <td>164,296</td>
            <td>0.7</td>
            <td>118,278</td>
            <td>0.5</td>
            <td>46,018</td>
            <td>0.2</td>
            <td>3,605,128</td>
            <td>15.1</td>
            <td>2022</td>
        </tr>
        <tr>
            <td>112年</td>
            <td>2,686,583</td>
            <td>3,963,022</td>
            <td>14.8</td>
            <td>23,164</td>
            <td>0.1</td>
            <td>12,908,690</td>
            <td>48.0</td>
            <td>6,238,287</td>
            <td>23.2</td>
            <td>1,741,014</td>
            <td>6.5</td>
            <td>4,497,273</td>
            <td>16.7</td>
            <td>238,759</td>
            <td>0.9</td>
            <td>171,338</td>
            <td>0.6</td>
            <td>67,420</td>
            <td>0.3</td>
            <td>3,493,913</td>
            <td>13.0</td>
            <td>2023</td>
        </tr>
        <tr>
            <td>113年</td>
            <td>3,333,264</td>
            <td>4,205,932</td>
            <td>12.6</td>
            <td>26,741</td>
            <td>0.1</td>
            <td>14,902,522</td>
            <td>44.7</td>
            <td>1,032,907</td>
            <td>31.0</td>
            <td>1,893,917</td>
            <td>5.7</td>
            <td>8,435,157</td>
            <td>25.3</td>
            <td>224,033</td>
            <td>0.7</td>
            <td>163,934</td>
            <td>0.5</td>
            <td>60,099</td>
            <td>0.2</td>
            <td>3,644,338</td>
            <td>10.9</td>
            <td>2024</td>
        </tr>
        <tr>
            <td>01月</td>
            <td>2,282,464</td>
            <td>203,520</td>
            <td>8.9</td>
            <td>2,459</td>
            <td>0.1</td>
            <td>833,467</td>
            <td>36.5</td>
            <td>8,997,477</td>
            <td>39.4</td>
            <td>2,407,217</td>
            <td>10.5</td>
            <td>659,026</td>
            <td>28.9</td>
            <td>23,054</td>
            <td>1.0</td>
            <td>17,376</td>
            <td>0.8</td>
            <td>5,678</td>
            <td>0.2</td>
            <td>320,216</td>
            <td>14.0</td>
            <td>2024/01</td>
        </tr>
        <tr>
            <td>02月</td>
            <td>2,432,162</td>
            <td>261,631</td>
            <td>10.8</td>
            <td>2,324</td>
            <td>0.1</td>
            <td>988,656</td>
            <td>40.6</td>
            <td>865,293</td>
            <td>35.6</td>
            <td>193,791</td>
            <td>8.0</td>
            <td>671,502</td>
            <td>27.6</td>
            <td>15,921</td>
            <td>0.7</td>
            <td>11,336</td>
            <td>0.5</td>
            <td>4,585</td>
            <td>0.2</td>
            <td>298,338</td>
            <td>12.3</td>
            <td>2024/02</td>
        </tr>
        <tr>
            <td>03月</td>
            <td>2,522,049</td>
            <td>254,525</td>
            <td>10.1</td>
            <td>2,369</td>
            <td>0.1</td>
            <td>1,133,129</td>
            <td>44.9</td>
            <td>809,452</td>
            <td>32.1</td>
            <td>175,012</td>
            <td>6.9</td>
            <td>634,439</td>
            <td>25.2</td>
            <td>21,788</td>
            <td>0.9</td>
            <td>16,467</td>
            <td>0.7</td>
            <td>5,321</td>
            <td>0.2</td>
            <td>300,786</td>
            <td>11.9</td>
            <td>2024/03</td>
        </tr>
        <tr>
            <td>04月</td>
            <td>2,120,097</td>
            <td>212,622</td>
            <td>10.0</td>
            <td>2,195</td>
            <td>0.1</td>
            <td>1,159,152</td>
            <td>54.7</td>
            <td>475,621</td>
            <td>22.4</td>
            <td>81,378</td>
            <td>3.8</td>
            <td>394,243</td>
            <td>18.6</td>
            <td>10,061</td>
            <td>0.5</td>
            <td>4,839</td>
            <td>0.2</td>
            <td>5,222</td>
            <td>0.2</td>
            <td>260,446</td>
            <td>12.3</td>
            <td>2024/04</td>
        </tr>
        <tr>
            <td>05月</td>
            <td>2,405,666</td>
            <td>247,073</td>
            <td>10.3</td>
            <td>2,257</td>
            <td>0.1</td>
            <td>1,192,645</td>
            <td>49.6</td>
            <td>647,082</td>
            <td>26.9</td>
            <td>100,818</td>
            <td>4.2</td>
            <td>546,264</td>
            <td>22.7</td>
            <td>13,991</td>
            <td>0.6</td>
            <td>8,326</td>
            <td>0.3</td>
            <td>5,664</td>
            <td>0.2</td>
            <td>302,618</td>
            <td>12.6</td>
            <td>2024/05</td>
        </tr>
        <tr>
            <td>06月</td>
            <td>2,801,774</td>
            <td>426,415</td>
            <td>15.2</td>
            <td>1,828</td>
            <td>0.1</td>
            <td>1,542,285</td>
            <td>55.0</td>
            <td>513,449</td>
            <td>18.3</td>
            <td>96,662</td>
            <td>3.5</td>
            <td>416,787</td>
            <td>14.9</td>
            <td>18,157</td>
            <td>0.6</td>
            <td>12,468</td>
            <td>0.4</td>
            <td>5,688</td>
            <td>0.2</td>
            <td>299,641</td>
            <td>10.7</td>
            <td>2024/06</td>
        </tr>
        <tr>
            <td>07月</td>
            <td>2,719,287</td>
            <td>469,469</td>
            <td>17.3</td>
            <td>1,939</td>
            <td>0.1</td>
            <td>1,545,672</td>
            <td>56.8</td>
            <td>358,171</td>
            <td>13.2</td>
            <td>71,163</td>
            <td>2.6</td>
            <td>287,009</td>
            <td>10.6</td>
            <td>20,319</td>
            <td>0.7</td>
            <td>14,968</td>
            <td>0.6</td>
            <td>5,352</td>
            <td>0.2</td>
            <td>323,716</td>
            <td>11.9</td>
            <td>2024/07</td>
        </tr>
        <tr>
            <td>08月</td>
            <td>2,922,395</td>
            <td>641,790</td>
            <td>22.0</td>
            <td>2,170</td>
            <td>0.1</td>
            <td>1,640,718</td>
            <td>56.1</td>
            <td>301,255</td>
            <td>10.3</td>
            <td>45,065</td>
            <td>1.5</td>
            <td>256,190</td>
            <td>8.8</td>
            <td>20,147</td>
            <td>0.7</td>
            <td>15,090</td>
            <td>0.5</td>
            <td>5,057</td>
            <td>0.2</td>
            <td>316,315</td>
            <td>10.8</td>
            <td>2024/08</td>
        </tr>
        <tr>
            <td>09月</td>
            <td>3,103,026</td>
            <td>365,395</td>
            <td>11.8</td>
            <td>2,222</td>
            <td>0.1</td>
            <td>1,489,008</td>
            <td>48.0</td>
            <td>915,139</td>
            <td>29.5</td>
            <td>59,597</td>
            <td>1.9</td>
            <td>855,542</td>
            <td>27.6</td>
            <td>19,187</td>
            <td>0.6</td>
            <td>15,000</td>
            <td>0.5</td>
            <td>4,188</td>
            <td>0.1</td>
            <td>312,076</td>
            <td>10.1</td>
            <td>2024/09</td>
        </tr>
        <tr>
            <td>10月</td>
            <td>3,274,881</td>
            <td>469,585</td>
            <td>14.3</td>
            <td>2,273</td>
            <td>0.1</td>
            <td>1,301,952</td>
            <td>39.8</td>
            <td>1,188,354</td>
            <td>36.3</td>
            <td>224,777</td>
            <td>6.9</td>
            <td>963,577</td>
            <td>29.4</td>
            <td>20,467</td>
            <td>0.6</td>
            <td>16,528</td>
            <td>0.5</td>
            <td>3,939</td>
            <td>0.1</td>
            <td>292,250</td>
            <td>8.9</td>
            <td>2024/10</td>
        </tr>
        <tr>
            <td>11月</td>
            <td>3,344,361</td>
            <td>440,749</td>
            <td>13.2</td>
            <td>2,107</td>
            <td>0.1</td>
            <td>1,049,314</td>
            <td>31.4</td>
            <td>1,554,633</td>
            <td>46.5</td>
            <td>277,149</td>
            <td>8.3</td>
            <td>1,277,485</td>
            <td>38.2</td>
            <td>19,932</td>
            <td>0.6</td>
            <td>15,154</td>
            <td>0.5</td>
            <td>4,778</td>
            <td>0.1</td>
            <td>277,626</td>
            <td>8.3</td>
            <td>2024/11</td>
        </tr>
        <tr>
            <td>12月</td>
            <td>3,404,476</td>
            <td>213,159</td>
            <td>6.3</td>
            <td>2,597</td>
            <td>0.1</td>
            <td>1,026,524</td>
            <td>30.2</td>
            <td>1,800,878</td>
            <td>52.9</td>
            <td>327,783</td>
            <td>9.6</td>
            <td>1,473,095</td>
            <td>43.3</td>
            <td>21,008</td>
            <td>0.6</td>
            <td>16,381</td>
            <td>0.5</td>
            <td>4,627</td>
            <td>0.1</td>
            <td>340,310</td>
            <td>10.0</td>
            <td>2024/12</td>
        </tr>
        <tr>
            <td>114年</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>2025</td>
        </tr>
        <tr>
            <td>01月</td>
            <td>3,055,060</td>
            <td>196,148</td>
            <td>6.4</td>
            <td>2,693</td>
            <td>0.1</td>
            <td>772,144</td>
            <td>25.3</td>
            <td>1,697,965</td>
            <td>55.6</td>
            <td>295,425</td>
            <td>9.7</td>
            <td>1,402,541</td>
            <td>45.9</td>
            <td>18,407</td>
            <td>0.6</td>
            <td>14,392</td>
            <td>0.5</td>
            <td>4,016</td>
            <td>0.1</td>
            <td>367,702</td>
            <td>12.0</td>
            <td>2025/01</td>
        </tr>
        <tr>
            <td>較上月(%)</td>
            <td>-10.3</td>
            <td colspan="2">-8.0</td>
            <td colspan="2">3.7</td>
            <td colspan="2">-24.8</td>
            <td colspan="2">-5.7</td>
            <td colspan="2">-9.9</td>
            <td colspan="2">-4.8</td>
            <td colspan="2">-12.4</td>
            <td colspan="2">-12.1</td>
            <td colspan="2">-13.2</td>
            <td colspan="2">8.0</td>
            <td>Compared with last month(%)</td>
        </tr>
        <tr>
            <td>較上年同月(%)</td>
            <td>33.8</td>
            <td colspan="2">-3.6</td>
            <td colspan="2">9.5</td>
            <td colspan="2">-7.4</td>
            <td colspan="2">88.7</td>
            <td colspan="2">22.7</td>
            <td colspan="2">112.8</td>
            <td colspan="2">-20.2</td>
            <td colspan="2">-17.2</td>
            <td colspan="2">-29.3</td>
            <td colspan="2">14.8</td>
            <td>Compared with the same month of last year(%)</td>
        </tr>
    <tr>
        <td colspan="22" class="note">
            註:風力資料自111年1月起納入併聯試運轉發電量,因初期運轉不穩,統計可能波動。<br>
            Note: Wind data includes grid-connected trial operations from Jan 2022; initial operation was unstable, so some fluctuations may occur.
        </td>
    </tr>
</tbody>

    </table>

    </body>
    </html>

  <tbody>
    <!-- 此處省略部分資料，可貼上完整的 HTML 程式碼顯示全部 -->
  </tbody>
</table>

        </body>
        <body>

  <h1>95～113年 各再生能源總發電量統計</h1>
  <table>
    <thead>
      <tr>
        <th>能源類型</th>
        <th>總發電量（千度）</th>
        <th>百分比 (%)</th>
      </tr>
    </thead>
    <tbody id="dataBody"></tbody>
    <tfoot>
      <tr>
        <td>總計</td>
        <td id="totalMWh"></td>
        <td>100%</td>
      </tr>
    </tfoot>
  </table>

  <script>
    const data = [
      { type: "水力", value: 87168146 },
      { type: "地熱", value: 86657 },
      { type: "太陽光電", value: 63990779 },
      { type: "風力", value: 42194492 },
      { type: "生質能", value: 4411895 },
      { type: "廢棄物", value: 63659063 }
    ];

    const total = data.reduce((sum, item) => sum + item.value, 0);
    document.getElementById("totalMWh").textContent = total.toLocaleString();

    const body = document.getElementById("dataBody");
    data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.type}</td>
        <td>${item.value.toLocaleString()}</td>
        <td>${((item.value / total) * 100).toFixed(2)}%</td>
      `;
      body.appendChild(row);
    });
  </script>

</body>
</html>
    </html> 