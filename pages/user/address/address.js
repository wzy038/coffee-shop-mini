Page({
  data: {
    addressList: [],
    selectedId: '',
    showForm: false,
    editId: '',
    formData: {
      name: '',
      gender: 'male',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      is_default: false
    },
    fromTakeaway: false,
    showTip: false,
    showRegionPicker: false,
    selectedProvince: '',
    selectedCity: '',
    selectedDistrict: '',
    cities: [],
    districts: [],
    pickerValue: [0, 0, 0],
    provinces: [
      { name: '福建省', cities: [
        { name: '福州市', districts: ['鼓楼区', '台江区', '仓山区', '晋安区', '马尾区'] },
        { name: '厦门市', districts: ['思明区', '海沧区', '湖里区', '集美区', '同安区', '翔安区'] },
        { name: '泉州市', districts: ['鲤城区', '丰泽区', '洛江区', '泉港区', '石狮市', '晋江市', '南安市', '惠安县', '安溪县', '永春县', '德化县'] },
        { name: '漳州市', districts: ['芗城区', '龙文区', '云霄县', '漳浦县', '诏安县', '长泰县', '东山县', '南靖县', '平和县', '华安县'] },
        { name: '莆田市', districts: ['城厢区', '涵江区', '荔城区', '秀屿区', '仙游县'] },
        { name: '宁德市', districts: ['蕉城区', '霞浦县', '古田县', '屏南县', '寿宁县', '周宁县', '柘荣县', '福安市', '福鼎市'] },
        { name: '三明市', districts: ['梅列区', '三元区', '明溪县', '清流县', '宁化县', '大田县', '尤溪县', '沙县', '将乐县', '泰宁县', '建宁县'] },
        { name: '南平市', districts: ['延平区', '建阳区', '顺昌县', '浦城县', '光泽县', '松溪县', '政和县', '邵武市', '武夷山市', '建瓯市'] },
        { name: '龙岩市', districts: ['新罗区', '永定区', '长汀县', '上杭县', '武平县', '连城县', '漳平市'] }
      ]},
      { name: '广东省', cities: [
        { name: '广州市', districts: ['天河区', '越秀区', '荔湾区', '海珠区', '白云区', '黄埔区', '番禺区', '花都区', '南沙区', '增城区', '从化区'] },
        { name: '深圳市', districts: ['福田区', '罗湖区', '南山区', '宝安区', '龙岗区', '盐田区', '龙华区', '坪山区', '光明区', '大鹏新区'] },
        { name: '东莞市', districts: ['莞城街道', '东城街道', '南城街道', '万江街道', '虎门镇', '长安镇', '厚街镇', '大朗镇'] },
        { name: '佛山市', districts: ['禅城区', '南海区', '顺德区', '三水区', '高明区'] },
        { name: '中山市', districts: ['石岐区', '东区', '西区', '南区', '五桂山区'] },
        { name: '惠州市', districts: ['惠城区', '惠阳区', '博罗县', '惠东县', '龙门县'] },
        { name: '江门市', districts: ['蓬江区', '江海区', '新会区', '台山市', '开平市', '鹤山市', '恩平市'] },
        { name: '珠海市', districts: ['香洲区', '斗门区', '金湾区'] },
        { name: '汕头市', districts: ['金平区', '龙湖区', '濠江区', '潮阳区', '潮南区', '澄海区', '南澳县'] },
        { name: '湛江市', districts: ['赤坎区', '霞山区', '坡头区', '麻章区', '遂溪县', '徐闻县', '廉江市', '雷州市', '吴川市'] }
      ]},
      { name: '浙江省', cities: [
        { name: '杭州市', districts: ['上城区', '下城区', '江干区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '富阳区', '临安区'] },
        { name: '宁波市', districts: ['海曙区', '江北区', '北仑区', '镇海区', '鄞州区', '奉化区', '象山县', '宁海县'] },
        { name: '温州市', districts: ['鹿城区', '龙湾区', '瓯海区', '洞头区', '永嘉县', '平阳县', '苍南县', '文成县', '泰顺县'] },
        { name: '嘉兴市', districts: ['南湖区', '秀洲区', '嘉善县', '海盐县', '海宁市', '平湖市', '桐乡市'] },
        { name: '湖州市', districts: ['吴兴区', '南浔区', '德清县', '长兴县', '安吉县'] },
        { name: '绍兴市', districts: ['越城区', '柯桥区', '上虞区', '新昌县', '诸暨市', '嵊州市'] },
        { name: '金华市', districts: ['婺城区', '金东区', '武义县', '浦江县', '磐安县', '兰溪市', '义乌市', '东阳市', '永康市'] },
        { name: '衢州市', districts: ['柯城区', '衢江区', '常山县', '开化县', '龙游县'] },
        { name: '舟山市', districts: ['定海区', '普陀区', '岱山县', '嵊泗县'] },
        { name: '台州市', districts: ['椒江区', '黄岩区', '路桥区', '玉环市', '三门县', '天台县', '仙居县'] },
        { name: '丽水市', districts: ['莲都区', '青田县', '缙云县', '遂昌县', '松阳县', '云和县', '庆元县', '景宁畲族自治县'] }
      ]},
      { name: '江苏省', cities: [
        { name: '南京市', districts: ['玄武区', '秦淮区', '建邺区', '鼓楼区', '浦口区', '栖霞区', '雨花台区', '江宁区', '六合区', '溧水区', '高淳区'] },
        { name: '苏州市', districts: ['姑苏区', '虎丘区', '吴中区', '相城区', '吴江区', '昆山市', '常熟市', '张家港市', '太仓市'] },
        { name: '无锡市', districts: ['梁溪区', '锡山区', '惠山区', '滨湖区', '新吴区', '江阴市', '宜兴市'] },
        { name: '常州市', districts: ['天宁区', '钟楼区', '新北区', '武进区', '金坛区', '溧阳市'] },
        { name: '镇江市', districts: ['京口区', '润州区', '丹徒区', '丹阳市', '扬中市', '句容市'] },
        { name: '扬州市', districts: ['广陵区', '邗江区', '江都区', '宝应县', '仪征市', '高邮市'] },
        { name: '泰州市', districts: ['海陵区', '高港区', '姜堰区', '兴化市', '靖江市', '泰兴市'] },
        { name: '南通市', districts: ['崇川区', '港闸区', '通州区', '如东县', '如皋市', '海门市', '启东市'] },
        { name: '盐城市', districts: ['亭湖区', '盐都区', '大丰区', '响水县', '滨海县', '阜宁县', '射阳县', '建湖县'] },
        { name: '淮安市', districts: ['淮安区', '淮阴区', '清江浦区', '洪泽区', '涟水县', '盱眙县', '金湖县'] },
        { name: '宿迁市', districts: ['宿城区', '宿豫区', '沭阳县', '泗阳县', '泗洪县'] },
        { name: '连云港市', districts: ['连云区', '海州区', '赣榆区', '东海县', '灌云县', '灌南县'] }
      ]},
      { name: '北京市', cities: [
        { name: '北京市', districts: ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区', '通州区', '顺义区', '昌平区', '大兴区', '房山区', '门头沟区', '怀柔区', '平谷区', '密云区', '延庆区'] }
      ]},
      { name: '上海市', cities: [
        { name: '上海市', districts: ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '浦东新区', '闵行区', '宝山区', '嘉定区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区'] }
      ]},
      { name: '天津市', cities: [
        { name: '天津市', districts: ['和平区', '河东区', '河西区', '南开区', '河北区', '红桥区', '东丽区', '西青区', '津南区', '北辰区', '武清区', '宝坻区', '滨海新区', '宁河区', '静海区', '蓟州区'] }
      ]},
      { name: '重庆市', cities: [
        { name: '重庆市', districts: ['渝中区', '大渡口区', '江北区', '沙坪坝区', '九龙坡区', '南岸区', '北碚区', '万盛区', '双桥区', '渝北区', '巴南区', '万州区', '涪陵区', '黔江区'] }
      ]},
      { name: '山东省', cities: [
        { name: '济南市', districts: ['历下区', '市中区', '槐荫区', '天桥区', '历城区', '长清区', '章丘区', '济阳区', '莱芜区'] },
        { name: '青岛市', districts: ['市南区', '市北区', '黄岛区', '崂山区', '李沧区', '城阳区', '即墨区'] },
        { name: '烟台市', districts: ['芝罘区', '福山区', '牟平区', '莱山区', '龙口市', '莱阳市', '莱州市', '蓬莱市'] },
        { name: '潍坊市', districts: ['潍城区', '寒亭区', '坊子区', '奎文区', '青州市', '诸城市', '寿光市', '安丘市'] },
        { name: '淄博市', districts: ['张店区', '淄川区', '博山区', '临淄区', '周村区'] },
        { name: '济宁市', districts: ['任城区', '兖州区', '曲阜市', '邹城市', '微山县', '鱼台县', '金乡县'] },
        { name: '泰安市', districts: ['泰山区', '岱岳区', '新泰市', '肥城市', '宁阳县', '东平县'] },
        { name: '威海市', districts: ['环翠区', '文登区', '荣成市', '乳山市'] },
        { name: '日照市', districts: ['东港区', '岚山区', '五莲县', '莒县'] },
        { name: '临沂市', districts: ['兰山区', '罗庄区', '河东区', '沂南县', '郯城县', '沂水县'] },
        { name: '德州市', districts: ['德城区', '陵城区', '乐陵市', '禹城市', '宁津县', '庆云县'] },
        { name: '聊城市', districts: ['东昌府区', '临清市', '阳谷县', '莘县', '茌平县'] },
        { name: '滨州市', districts: ['滨城区', '沾化区', '惠民县', '阳信县', '无棣县'] },
        { name: '菏泽市', districts: ['牡丹区', '定陶区', '曹县', '单县', '成武县'] }
      ]},
      { name: '四川省', cities: [
        { name: '成都市', districts: ['锦江区', '青羊区', '金牛区', '武侯区', '成华区', '龙泉驿区', '青白江区', '新都区', '温江区', '双流区', '郫都区'] },
        { name: '绵阳市', districts: ['涪城区', '游仙区', '安州区', '江油市', '三台县', '盐亭县'] },
        { name: '自贡市', districts: ['自流井区', '贡井区', '大安区', '沿滩区', '荣县', '富顺县'] },
        { name: '攀枝花市', districts: ['东区', '西区', '仁和区', '米易县', '盐边县'] },
        { name: '泸州市', districts: ['江阳区', '纳溪区', '龙马潭区', '泸县', '合江县', '叙永县'] },
        { name: '德阳市', districts: ['旌阳区', '罗江区', '广汉市', '什邡市', '绵竹市', '中江县'] },
        { name: '广元市', districts: ['利州区', '昭化区', '朝天区', '旺苍县', '青川县', '剑阁县'] },
        { name: '遂宁市', districts: ['船山区', '安居区', '蓬溪县', '射洪市', '大英县'] },
        { name: '内江市', districts: ['市中区', '东兴区', '威远县', '资中县', '隆昌县'] },
        { name: '乐山市', districts: ['市中区', '沙湾区', '五通桥区', '金口河区', '犍为县', '井研县'] },
        { name: '南充市', districts: ['顺庆区', '高坪区', '嘉陵区', '南部县', '营山县', '蓬安县'] },
        { name: '眉山市', districts: ['东坡区', '彭山区', '仁寿县', '洪雅县', '丹棱县'] },
        { name: '宜宾市', districts: ['翠屏区', '南溪区', '叙州区', '江安县', '长宁县', '高县'] },
        { name: '广安市', districts: ['广安区', '前锋区', '华蓥市', '岳池县', '武胜县'] },
        { name: '达州市', districts: ['通川区', '达川区', '万源市', '宣汉县', '开江县'] },
        { name: '雅安市', districts: ['雨城区', '名山区', '荥经县', '汉源县', '石棉县'] },
        { name: '巴中市', districts: ['巴州区', '恩阳区', '通江县', '南江县', '平昌县'] },
        { name: '资阳市', districts: ['雁江区', '安岳县', '乐至县'] }
      ]},
      { name: '湖南省', cities: [
        { name: '长沙市', districts: ['芙蓉区', '天心区', '岳麓区', '开福区', '雨花区', '望城区', '长沙县', '宁乡市'] },
        { name: '株洲市', districts: ['天元区', '荷塘区', '芦淞区', '石峰区', '株洲县', '攸县'] },
        { name: '湘潭市', districts: ['雨湖区', '岳塘区', '湘潭县', '湘乡市', '韶山市'] },
        { name: '衡阳市', districts: ['雁峰区', '石鼓区', '珠晖区', '蒸湘区', '南岳区', '衡阳县'] },
        { name: '邵阳市', districts: ['双清区', '大祥区', '北塔区', '邵东县', '新邵县'] },
        { name: '岳阳市', districts: ['岳阳楼区', '云溪区', '君山区', '岳阳县', '华容县'] },
        { name: '常德市', districts: ['武陵区', '鼎城区', '安乡县', '汉寿县', '澧县'] },
        { name: '张家界市', districts: ['永定区', '武陵源区', '慈利县', '桑植县'] },
        { name: '益阳市', districts: ['资阳区', '赫山区', '南县', '桃江县', '安化县'] },
        { name: '郴州市', districts: ['北湖区', '苏仙区', '桂阳县', '宜章县', '永兴县'] },
        { name: '永州市', districts: ['零陵区', '冷水滩区', '祁阳县', '东安县', '双牌县'] },
        { name: '怀化市', districts: ['鹤城区', '中方县', '沅陵县', '辰溪县', '溆浦县'] },
        { name: '娄底市', districts: ['娄星区', '双峰县', '新化县', '冷水江市', '涟源市'] }
      ]},
      { name: '湖北省', cities: [
        { name: '武汉市', districts: ['江岸区', '江汉区', '硚口区', '汉阳区', '武昌区', '青山区', '洪山区', '东西湖区', '汉南区', '蔡甸区', '江夏区', '黄陂区', '新洲区'] },
        { name: '黄石市', districts: ['黄石港区', '西塞山区', '下陆区', '铁山区', '阳新县'] },
        { name: '十堰市', districts: ['茅箭区', '张湾区', '郧阳区', '郧西县', '竹山县'] },
        { name: '宜昌市', districts: ['西陵区', '伍家岗区', '点军区', '猇亭区', '夷陵区', '远安县'] },
        { name: '襄阳市', districts: ['襄城区', '樊城区', '襄州区', '南漳县', '谷城县'] },
        { name: '鄂州市', districts: ['鄂城区', '华容区', '梁子湖区'] },
        { name: '荆门市', districts: ['东宝区', '掇刀区', '京山市', '沙洋县'] },
        { name: '孝感市', districts: ['孝南区', '孝昌县', '大悟县', '云梦县', '应城市'] },
        { name: '荆州市', districts: ['沙市区', '荆州区', '公安县', '监利县', '江陵县'] },
        { name: '黄冈市', districts: ['黄州区', '团风县', '红安县', '罗田县', '英山县'] },
        { name: '咸宁市', districts: ['咸安区', '嘉鱼县', '通城县', '崇阳县', '通山县'] },
        { name: '随州市', districts: ['曾都区', '随县'] },
        { name: '恩施土家族苗族自治州', districts: ['恩施市', '利川市', '建始县', '巴东县'] }
      ]},
      { name: '河南省', cities: [
        { name: '郑州市', districts: ['中原区', '二七区', '管城回族区', '金水区', '上街区', '惠济区', '中牟县', '巩义市'] },
        { name: '开封市', districts: ['龙亭区', '顺河回族区', '鼓楼区', '禹王台区', '祥符区'] },
        { name: '洛阳市', districts: ['老城区', '西工区', '瀍河回族区', '涧西区', '吉利区', '洛龙区'] },
        { name: '平顶山市', districts: ['新华区', '卫东区', '石龙区', '湛河区', '宝丰县'] },
        { name: '安阳市', districts: ['文峰区', '北关区', '殷都区', '龙安区', '安阳县'] },
        { name: '鹤壁市', districts: ['鹤山区', '山城区', '淇滨区'] },
        { name: '新乡市', districts: ['红旗区', '卫滨区', '凤泉区', '牧野区', '新乡县'] },
        { name: '焦作市', districts: ['解放区', '中站区', '马村区', '山阳区'] },
        { name: '濮阳市', districts: ['华龙区', '濮阳县'] },
        { name: '许昌市', districts: ['魏都区', '建安区', '禹州市', '长葛市'] },
        { name: '漯河市', districts: ['源汇区', '郾城区', '召陵区'] },
        { name: '三门峡市', districts: ['湖滨区', '陕州区', '灵宝市'] },
        { name: '南阳市', districts: ['宛城区', '卧龙区', '南召县', '方城县'] },
        { name: '商丘市', districts: ['梁园区', '睢阳区', '民权县', '睢县'] },
        { name: '信阳市', districts: ['浉河区', '平桥区', '罗山县', '光山县'] },
        { name: '周口市', districts: ['川汇区', '扶沟县', '西华县', '商水县'] },
        { name: '驻马店市', districts: ['驿城区', '西平县', '上蔡县', '平舆县'] }
      ]},
      { name: '安徽省', cities: [
        { name: '合肥市', districts: ['瑶海区', '庐阳区', '蜀山区', '包河区', '长丰县', '肥东县', '肥西县'] },
        { name: '芜湖市', districts: ['镜湖区', '弋江区', '鸠江区', '三山区', '芜湖县'] },
        { name: '蚌埠市', districts: ['龙子湖区', '蚌山区', '禹会区', '淮上区'] },
        { name: '淮南市', districts: ['大通区', '田家庵区', '谢家集区', '八公山区'] },
        { name: '马鞍山市', districts: ['花山区', '雨山区', '博望区'] },
        { name: '淮北市', districts: ['杜集区', '相山区', '烈山区'] },
        { name: '铜陵市', districts: ['铜官区', '义安区', '郊区'] },
        { name: '安庆市', districts: ['迎江区', '大观区', '宜秀区', '怀宁县'] },
        { name: '黄山市', districts: ['屯溪区', '黄山区', '徽州区', '歙县'] },
        { name: '滁州市', districts: ['琅琊区', '南谯区', '天长市', '明光市'] },
        { name: '阜阳市', districts: ['颍州区', '颍东区', '颍泉区', '临泉县'] },
        { name: '宿州市', districts: ['埇桥区', '砀山县', '萧县'] },
        { name: '六安市', districts: ['金安区', '裕安区', '叶集区'] },
        { name: '亳州市', districts: ['谯城区', '涡阳县', '蒙城县'] },
        { name: '池州市', districts: ['贵池区', '东至县', '石台县'] },
        { name: '宣城市', districts: ['宣州区', '郎溪县', '广德县'] }
      ]},
      { name: '江西省', cities: [
        { name: '南昌市', districts: ['东湖区', '西湖区', '青云谱区', '湾里区', '青山湖区', '新建区'] },
        { name: '景德镇市', districts: ['珠山区', '昌江区', '浮梁县'] },
        { name: '萍乡市', districts: ['安源区', '湘东区', '莲花县'] },
        { name: '九江市', districts: ['浔阳区', '濂溪区', '柴桑区', '武宁县'] },
        { name: '新余市', districts: ['渝水区', '分宜县'] },
        { name: '鹰潭市', districts: ['月湖区', '余江区', '贵溪市'] },
        { name: '赣州市', districts: ['章贡区', '南康区', '赣县区', '信丰县'] },
        { name: '吉安市', districts: ['吉州区', '青原区', '吉安县'] },
        { name: '宜春市', districts: ['袁州区', '丰城市', '樟树市'] },
        { name: '抚州市', districts: ['临川区', '东乡区', '南城县'] },
        { name: '上饶市', districts: ['信州区', '广丰区', '广信区'] }
      ]},
      { name: '河北省', cities: [
        { name: '石家庄市', districts: ['长安区', '桥西区', '新华区', '裕华区', '井陉矿区', '藁城区', '鹿泉区'] },
        { name: '唐山市', districts: ['路南区', '路北区', '古冶区', '开平区', '丰南区'] },
        { name: '秦皇岛市', districts: ['海港区', '山海关区', '北戴河区'] },
        { name: '邯郸市', districts: ['邯山区', '丛台区', '复兴区', '峰峰矿区'] },
        { name: '邢台市', districts: ['桥东区', '桥西区', '邢台县'] },
        { name: '保定市', districts: ['竞秀区', '莲池区', '满城区', '清苑区'] },
        { name: '张家口市', districts: ['桥东区', '桥西区', '宣化区', '下花园区'] },
        { name: '承德市', districts: ['双桥区', '双滦区', '鹰手营子矿区'] },
        { name: '沧州市', districts: ['运河区', '新华区', '泊头市', '任丘市'] },
        { name: '廊坊市', districts: ['安次区', '广阳区', '三河市', '霸州市'] },
        { name: '衡水市', districts: ['桃城区', '冀州区'] }
      ]},
      { name: '山西省', cities: [
        { name: '太原市', districts: ['小店区', '迎泽区', '杏花岭区', '尖草坪区', '万柏林区', '晋源区'] },
        { name: '大同市', districts: ['平城区', '云冈区', '新荣区', '云州区'] },
        { name: '阳泉市', districts: ['城区', '矿区', '郊区'] },
        { name: '长治市', districts: ['潞州区', '上党区', '屯留区', '潞城区'] },
        { name: '晋城市', districts: ['城区', '沁水县', '阳城县'] },
        { name: '朔州市', districts: ['朔城区', '平鲁区'] },
        { name: '晋中市', districts: ['榆次区', '太谷区', '祁县'] },
        { name: '运城市', districts: ['盐湖区', '永济市', '河津市'] },
        { name: '忻州市', districts: ['忻府区', '原平市'] },
        { name: '临汾市', districts: ['尧都区', '侯马市', '霍州市'] },
        { name: '吕梁市', districts: ['离石区', '孝义市', '汾阳市'] }
      ]},
      { name: '陕西省', cities: [
        { name: '西安市', districts: ['新城区', '碑林区', '莲湖区', '灞桥区', '未央区', '雁塔区', '阎良区', '临潼区', '长安区', '高陵区'] },
        { name: '铜川市', districts: ['王益区', '印台区', '耀州区'] },
        { name: '宝鸡市', districts: ['渭滨区', '金台区', '陈仓区'] },
        { name: '咸阳市', districts: ['秦都区', '渭城区', '兴平市'] },
        { name: '渭南市', districts: ['临渭区', '华州区', '韩城市'] },
        { name: '延安市', districts: ['宝塔区', '延长县', '延川县'] },
        { name: '汉中市', districts: ['汉台区', '南郑区', '城固县'] },
        { name: '榆林市', districts: ['榆阳区', '横山区', '神木市'] },
        { name: '安康市', districts: ['汉滨区', '旬阳县'] },
        { name: '商洛市', districts: ['商州区', '洛南县'] }
      ]},
      { name: '云南省', cities: [
        { name: '昆明市', districts: ['五华区', '盘龙区', '官渡区', '西山区', '东川区', '呈贡区'] },
        { name: '曲靖市', districts: ['麒麟区', '沾益区', '马龙区'] },
        { name: '玉溪市', districts: ['红塔区', '江川区'] },
        { name: '保山市', districts: ['隆阳区', '腾冲市'] },
        { name: '昭通市', districts: ['昭阳区', '鲁甸县'] },
        { name: '丽江市', districts: ['古城区', '玉龙纳西族自治县'] },
        { name: '普洱市', districts: ['思茅区', '宁洱哈尼族彝族自治县'] },
        { name: '临沧市', districts: ['临翔区', '凤庆县'] },
        { name: '楚雄彝族自治州', districts: ['楚雄市', '双柏县'] },
        { name: '红河哈尼族彝族自治州', districts: ['蒙自市', '个旧市', '开远市'] },
        { name: '文山壮族苗族自治州', districts: ['文山市', '砚山县'] },
        { name: '西双版纳傣族自治州', districts: ['景洪市', '勐海县'] },
        { name: '大理白族自治州', districts: ['大理市', '祥云县'] },
        { name: '德宏傣族景颇族自治州', districts: ['芒市', '瑞丽市'] },
        { name: '怒江傈僳族自治州', districts: ['泸水市'] },
        { name: '迪庆藏族自治州', districts: ['香格里拉市'] }
      ]},
      { name: '贵州省', cities: [
        { name: '贵阳市', districts: ['南明区', '云岩区', '花溪区', '乌当区', '白云区', '观山湖区'] },
        { name: '六盘水市', districts: ['钟山区', '六枝特区', '水城县'] },
        { name: '遵义市', districts: ['红花岗区', '汇川区', '播州区'] },
        { name: '安顺市', districts: ['西秀区', '平坝区'] },
        { name: '毕节市', districts: ['七星关区'] },
        { name: '铜仁市', districts: ['碧江区', '万山区'] },
        { name: '黔西南布依族苗族自治州', districts: ['兴义市'] },
        { name: '黔东南苗族侗族自治州', districts: ['凯里市'] },
        { name: '黔南布依族苗族自治州', districts: ['都匀市', '福泉市'] }
      ]},
      { name: '广西壮族自治区', cities: [
        { name: '南宁市', districts: ['兴宁区', '青秀区', '江南区', '西乡塘区', '良庆区', '邕宁区'] },
        { name: '柳州市', districts: ['城中区', '鱼峰区', '柳南区', '柳北区'] },
        { name: '桂林市', districts: ['秀峰区', '叠彩区', '象山区', '七星区', '雁山区'] },
        { name: '梧州市', districts: ['万秀区', '长洲区', '龙圩区'] },
        { name: '北海市', districts: ['海城区', '银海区', '铁山港区'] },
        { name: '防城港市', districts: ['港口区', '防城区'] },
        { name: '钦州市', districts: ['钦南区', '钦北区'] },
        { name: '贵港市', districts: ['港北区', '港南区', '覃塘区'] },
        { name: '玉林市', districts: ['玉州区', '福绵区'] },
        { name: '百色市', districts: ['右江区', '田阳区'] },
        { name: '贺州市', districts: ['八步区', '平桂区'] },
        { name: '河池市', districts: ['宜州区', '金城江区'] },
        { name: '来宾市', districts: ['兴宾区'] },
        { name: '崇左市', districts: ['江州区'] }
      ]},
      { name: '海南省', cities: [
        { name: '海口市', districts: ['秀英区', '龙华区', '琼山区', '美兰区'] },
        { name: '三亚市', districts: ['海棠区', '吉阳区', '天涯区', '崖州区'] },
        { name: '三沙市', districts: [] },
        { name: '儋州市', districts: [] },
        { name: '文昌市', districts: [] },
        { name: '琼海市', districts: [] },
        { name: '万宁市', districts: [] },
        { name: '东方市', districts: [] }
      ]},
      { name: '辽宁省', cities: [
        { name: '沈阳市', districts: ['和平区', '沈河区', '大东区', '皇姑区', '铁西区', '苏家屯区', '浑南区', '沈北新区'] },
        { name: '大连市', districts: ['中山区', '西岗区', '沙河口区', '甘井子区', '旅顺口区', '金州区'] },
        { name: '鞍山市', districts: ['铁东区', '铁西区', '立山区', '千山区'] },
        { name: '抚顺市', districts: ['新抚区', '东洲区', '望花区', '顺城区'] },
        { name: '本溪市', districts: ['平山区', '溪湖区', '明山区', '南芬区'] },
        { name: '丹东市', districts: ['元宝区', '振兴区', '振安区'] },
        { name: '锦州市', districts: ['古塔区', '凌河区', '太和区'] },
        { name: '营口市', districts: ['站前区', '西市区', '鲅鱼圈区', '老边区'] },
        { name: '阜新市', districts: ['海州区', '新邱区', '太平区', '清河门区'] },
        { name: '辽阳市', districts: ['白塔区', '文圣区', '宏伟区', '弓长岭区'] },
        { name: '盘锦市', districts: ['双台子区', '兴隆台区'] },
        { name: '铁岭市', districts: ['银州区', '清河区'] },
        { name: '朝阳市', districts: ['双塔区', '龙城区'] },
        { name: '葫芦岛市', districts: ['连山区', '龙港区', '南票区'] }
      ]},
      { name: '吉林省', cities: [
        { name: '长春市', districts: ['南关区', '宽城区', '朝阳区', '二道区', '绿园区', '双阳区', '九台区'] },
        { name: '吉林市', districts: ['昌邑区', '龙潭区', '船营区', '丰满区'] },
        { name: '四平市', districts: ['铁西区', '铁东区'] },
        { name: '辽源市', districts: ['龙山区', '西安区'] },
        { name: '通化市', districts: ['东昌区', '二道江区'] },
        { name: '白山市', districts: ['浑江区', '江源区'] },
        { name: '松原市', districts: ['宁江区'] },
        { name: '白城市', districts: ['洮北区'] },
        { name: '延边朝鲜族自治州', districts: ['延吉市', '图们市', '敦化市'] }
      ]},
      { name: '黑龙江省', cities: [
        { name: '哈尔滨市', districts: ['道里区', '南岗区', '道外区', '香坊区', '平房区', '松北区', '呼兰区', '阿城区'] },
        { name: '齐齐哈尔市', districts: ['龙沙区', '建华区', '铁锋区', '昂昂溪区'] },
        { name: '鸡西市', districts: ['鸡冠区', '恒山区', '滴道区', '梨树区'] },
        { name: '鹤岗市', districts: ['向阳区', '工农区', '南山区', '兴安区'] },
        { name: '双鸭山市', districts: ['尖山区', '岭东区', '四方台区'] },
        { name: '大庆市', districts: ['萨尔图区', '龙凤区', '让胡路区'] },
        { name: '伊春市', districts: ['伊春区', '南岔区', '友好区'] },
        { name: '佳木斯市', districts: ['向阳区', '前进区', '东风区'] },
        { name: '七台河市', districts: ['新兴区', '桃山区', '茄子河区'] },
        { name: '牡丹江市', districts: ['东安区', '阳明区', '爱民区', '西安区'] },
        { name: '黑河市', districts: ['爱辉区'] },
        { name: '绥化市', districts: ['北林区'] },
        { name: '大兴安岭地区', districts: ['加格达奇区'] }
      ]},
      { name: '内蒙古自治区', cities: [
        { name: '呼和浩特市', districts: ['新城区', '回民区', '玉泉区', '赛罕区'] },
        { name: '包头市', districts: ['东河区', '昆都仑区', '青山区', '石拐区'] },
        { name: '乌海市', districts: ['海勃湾区', '海南区', '乌达区'] },
        { name: '赤峰市', districts: ['红山区', '元宝山区', '松山区'] },
        { name: '通辽市', districts: ['科尔沁区'] },
        { name: '鄂尔多斯市', districts: ['东胜区', '康巴什区'] },
        { name: '呼伦贝尔市', districts: ['海拉尔区', '扎赉诺尔区'] },
        { name: '巴彦淖尔市', districts: ['临河区'] },
        { name: '乌兰察布市', districts: ['集宁区'] }
      ]},
      { name: '新疆维吾尔自治区', cities: [
        { name: '乌鲁木齐市', districts: ['天山区', '沙依巴克区', '新市区', '水磨沟区', '头屯河区', '达坂城区'] },
        { name: '克拉玛依市', districts: ['克拉玛依区', '独山子区', '白碱滩区'] },
        { name: '吐鲁番市', districts: ['高昌区'] },
        { name: '哈密市', districts: ['伊州区'] },
        { name: '昌吉回族自治州', districts: ['昌吉市'] },
        { name: '博尔塔拉蒙古自治州', districts: ['博乐市'] },
        { name: '巴音郭楞蒙古自治州', districts: ['库尔勒市'] },
        { name: '阿克苏地区', districts: ['阿克苏市'] },
        { name: '克孜勒苏柯尔克孜自治州', districts: ['阿图什市'] },
        { name: '喀什地区', districts: ['喀什市'] },
        { name: '和田地区', districts: ['和田市'] },
        { name: '伊犁哈萨克自治州', districts: ['伊宁市'] },
        { name: '塔城地区', districts: ['塔城市'] },
        { name: '阿勒泰地区', districts: ['阿勒泰市'] }
      ]},
      { name: '西藏自治区', cities: [
        { name: '拉萨市', districts: ['城关区', '堆龙德庆区'] },
        { name: '日喀则市', districts: ['桑珠孜区'] },
        { name: '昌都市', districts: ['卡若区'] },
        { name: '林芝市', districts: ['巴宜区'] },
        { name: '山南市', districts: ['乃东区'] },
        { name: '那曲市', districts: ['色尼区'] },
        { name: '阿里地区', districts: ['噶尔县'] }
      ]},
      { name: '宁夏回族自治区', cities: [
        { name: '银川市', districts: ['兴庆区', '西夏区', '金凤区'] },
        { name: '石嘴山市', districts: ['大武口区', '惠农区'] },
        { name: '吴忠市', districts: ['利通区', '红寺堡区'] },
        { name: '固原市', districts: ['原州区'] },
        { name: '中卫市', districts: ['沙坡头区'] }
      ]},
      { name: '青海省', cities: [
        { name: '西宁市', districts: ['城东区', '城中区', '城西区', '城北区', '湟中区'] },
        { name: '海东市', districts: ['乐都区', '平安区'] },
        { name: '海北藏族自治州', districts: ['海晏县'] },
        { name: '黄南藏族自治州', districts: ['同仁县'] },
        { name: '海南藏族自治州', districts: ['共和县'] },
        { name: '果洛藏族自治州', districts: ['玛沁县'] },
        { name: '玉树藏族自治州', districts: ['玉树市'] },
        { name: '海西蒙古族藏族自治州', districts: ['德令哈市', '格尔木市'] }
      ]},
      { name: '台湾省', cities: [
        { name: '台北市', districts: ['中正区', '大同区', '中山区', '松山区', '大安区', '万华区'] },
        { name: '新北市', districts: ['板桥区', '新庄区', '中和区', '永和区'] },
        { name: '桃园市', districts: ['桃园区', '中坜区', '平镇区'] },
        { name: '台中市', districts: ['中区', '东区', '南区', '西区'] },
        { name: '台南市', districts: ['中西区', '东区', '南区'] },
        { name: '高雄市', districts: ['楠梓区', '左营区', '三民区'] }
      ]},
      { name: '香港特别行政区', cities: [
        { name: '香港', districts: ['中西区', '湾仔区', '东区', '南区', '油尖旺区', '深水埗区'] }
      ]},
      { name: '澳门特别行政区', cities: [
        { name: '澳门', districts: ['澳门半岛', '氹仔', '路环'] }
      ]}
    ],
    cities: [],
    districts: []
  },

  onLoad(options) {
    this.setData({
      fromTakeaway: options.from === 'takeaway' ? true : false,
      fromGoods: options.from === 'goods' ? true : false,
      selectedId: options.selectedId || ''
    })
    this.loadAddressList()
  },

  loadAddressList() {
    const user = wx.getStorageSync("userInfo") || {}
    const uid = user.uid || user.nickName || user.phone || '0'
    const cacheKey = 'addressList_' + uid

    // 先加载本地缓存
    let list = wx.getStorageSync(cacheKey) || []
    this.setData({ addressList: list })

    // 再尝试从后端加载
    wx.request({
      url: 'http://192.168.237.84/api/address.php?action=list&uid=' + uid,
      success: (res) => {
        let result = res.data
        if (typeof result === 'string') {
          const match = result.match(/\{[^}]+\}/)
          if (match) {
            try {
              result = JSON.parse(match[0])
            } catch (e) {}
          }
        }
        if (result && result.code === 200 && result.data && result.data.length > 0) {
          this.setData({ addressList: result.data })
          wx.setStorageSync(cacheKey, result.data)
        }
      }
    })
  },

  selectAddr(e) {
    const item = e.currentTarget.dataset.item
    if (this.data.fromTakeaway || this.data.fromGoods) {
      wx.setStorageSync("selectedAddress", item)
      wx.navigateBack()
    } else {
      this.setData({ selectedId: item.id })
    }
  },

  addAddr() {
    this.setData({
      showForm: true,
      editId: '',
      formData: {
        name: '',
        gender: 'male',
        phone: '',
        province: '',
        city: '',
        district: '',
        detail: '',
        is_default: false
      }
    })
  },

  editAddr(e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      showForm: true,
      editId: item.id,
      formData: {
        name: item.name,
        gender: item.gender,
        phone: item.phone,
        province: item.province,
        city: item.city,
        district: item.district,
        detail: item.detail,
        is_default: item.is_default == 1
      }
    })
  },

  deleteAddr(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定删除该地址吗？',
      success: (res) => {
        if (res.confirm) {
          const user = wx.getStorageSync("userInfo") || {}
          const uid = user.uid || user.nickName || user.phone || '0'
          const cacheKey = 'addressList_' + uid

          // 先从本地缓存删除
          let list = wx.getStorageSync(cacheKey) || []
          const deletedItem = list.find(item => item.id == id)
          list = list.filter(item => item.id != id)
          wx.setStorageSync(cacheKey, list)
          this.setData({ addressList: list })

          // 删除地址后清除选中状态，防止显示已删除的地址
          wx.removeStorageSync("selectedAddress")

          wx.request({
            url: 'http://192.168.237.84/api/address.php?action=delete',
            method: 'POST',
            data: { uid, id },
            success: (res) => {
              let result = res.data
              if (typeof result === 'string') {
                const match = result.match(/\{[^}]+\}/)
                if (match) {
                  try { result = JSON.parse(match[0]) } catch (e) {}
                }
              }
              if (result && result.code === 200) {
                wx.showToast({ title: '删除成功', icon: 'success' })
              }
            }
          })
        }
      }
    })
  },

  selectGender(e) {
    this.setData({ 'formData.gender': e.currentTarget.dataset.value })
  },

  inputName(e) {
    this.setData({ 'formData.name': e.detail.value })
  },

  inputPhone(e) {
    this.setData({ 'formData.phone': e.detail.value })
  },

  inputDetail(e) {
    this.setData({ 'formData.detail': e.detail.value })
  },

  inputProvince(e) {
    this.setData({ 'formData.province': e.detail.value })
  },

  inputCity(e) {
    this.setData({ 'formData.city': e.detail.value })
  },

  inputDistrict(e) {
    this.setData({ 'formData.district': e.detail.value })
  },

  showRegionPicker() {
    const { province, city, district } = this.data.formData
    let pickerValue = [0, 0, 0]
    const newData = {
      showRegionPicker: true,
      selectedProvince: province || '',
      selectedCity: city || '',
      selectedDistrict: district || '',
      cities: [],
      districts: [],
      pickerValue: pickerValue
    }
    if (province) {
      const pIndex = this.data.provinces.findIndex(item => item.name === province)
      if (pIndex >= 0) {
        const p = this.data.provinces[pIndex]
        newData.cities = p.cities
        pickerValue[0] = pIndex
        if (city) {
          const cIndex = p.cities.findIndex(item => item.name === city)
          if (cIndex >= 0) {
            const c = p.cities[cIndex]
            newData.districts = c.districts
            pickerValue[1] = cIndex
            if (district) {
              const dIndex = c.districts.findIndex(item => item === district)
              if (dIndex >= 0) pickerValue[2] = dIndex
            }
          }
        }
      }
    }
    newData.pickerValue = pickerValue
    this.setData(newData)
  },

  hideRegionPicker() {
    this.setData({ showRegionPicker: false })
  },

  stopPropagation() {
    // 阻止事件冒泡
  },

  onPickerChange(e) {
    const val = e.detail.value
    const provinceIndex = val[0] || 0
    const cityIndex = val[1] || 0
    const districtIndex = val[2] || 0

    const province = this.data.provinces[provinceIndex]
    if (!province) return

    const city = province.cities[cityIndex] || province.cities[0]
    const district = city ? (city.districts[districtIndex] || city.districts[0]) : ''

    this.setData({
      selectedProvince: province.name,
      selectedCity: city ? city.name : '',
      selectedDistrict: district || '',
      cities: province.cities,
      districts: city ? city.districts : []
    })
  },

  confirmRegion() {
    if (!this.data.selectedProvince) {
      wx.showToast({ title: '请选择省份', icon: 'none' })
      return
    }
    this.setData({
      'formData.province': this.data.selectedProvince,
      'formData.city': this.data.selectedCity,
      'formData.district': this.data.selectedDistrict,
      showRegionPicker: false
    })
  },

  selectRegion() {
    const that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation']) {
          that._chooseLocation()
        } else {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              that._chooseLocation()
            },
            fail() {
              wx.showModal({
                title: '提示',
                content: '需要获取位置权限才能选择地址，是否去设置？',
                showCancel: true,
                success(r) {
                  if (r.confirm) {
                    wx.openSetting()
                  }
                }
              })
            }
          })
        }
      }
    })
  },

  _chooseLocation() {
    const that = this
    wx.chooseLocation({
      success: (res) => {
        const addr = res.address || ''
        const name = res.name || ''
        
        let province = ''
        let city = ''
        let district = ''
        let detail = name

        const provinceMatch = addr.match(/([\u4e00-\u9fa5]+省)/)
        const cityMatch = addr.match(/([\u4e00-\u9fa5]+市)/)
        const districtMatch = addr.match(/([\u4e00-\u9fa5]+区)/)

        if (provinceMatch) province = provinceMatch[1]
        if (cityMatch) city = cityMatch[1]
        if (districtMatch) district = districtMatch[1]

        let remaining = addr
        if (province) remaining = remaining.replace(province, '')
        if (city) remaining = remaining.replace(city, '')
        if (district) remaining = remaining.replace(district, '')

        if (remaining.trim()) {
          detail = (name ? name + ' ' : '') + remaining.trim()
        }

        that.setData({
          'formData.province': province,
          'formData.city': city,
          'formData.district': district,
          'formData.detail': detail
        })
      },
      fail: (err) => {
        console.log('chooseLocation fail:', err)
        if (err.errMsg && err.errMsg.indexOf('cancel') > -1) {
          return
        }
        wx.showModal({
          title: '地图选择失败',
          content: '无法使用地图选择地址，请尝试手动输入或检查网络',
          confirmText: '确定',
          showCancel: false
        })
      }
    })
  },

  closeTip() {
    this.setData({ showTip: false })
  },

  toggleDefault() {
    this.setData({ 'formData.is_default': !this.data.formData.is_default })
  },

  saveAddr() {
    console.log('saveAddr called', this.data.formData)
    const { formData, editId } = this.data
    const user = wx.getStorageSync("userInfo") || {}
    const uid = user.uid || user.nickName || user.phone || 'user_' + Date.now()

    if (!formData.name || !formData.name.trim()) {
      wx.showToast({ title: '请输入联系人', icon: 'none' })
      return
    }
    if (!formData.phone || !formData.phone.trim()) {
      wx.showToast({ title: '请输入手机号', icon: 'none' })
      return
    }
    if (!formData.province) {
      wx.showToast({ title: '请选择地址', icon: 'none' })
      return
    }

    const action = editId ? 'update' : 'add'
    const data = {
      uid,
      id: editId,
      name: formData.name,
      gender: formData.gender,
      phone: formData.phone,
      province: formData.province,
      city: formData.city,
      district: formData.district,
      detail: formData.detail,
      is_default: formData.is_default ? 1 : 0
    }

    console.log('request data:', data)

    // 同时保存到本地缓存
    const cacheKey = 'addressList_' + uid
    let list = wx.getStorageSync(cacheKey) || []

    if (editId) {
      // 编辑
      const idx = list.findIndex(item => item.id == editId)
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...data, id: editId }
      }
    } else {
      // 新增
      const newId = Date.now().toString()
      list.push({ ...data, id: newId })
    }
    wx.setStorageSync(cacheKey, list)
    this.setData({ addressList: list, showForm: false })

    wx.showLoading({ title: '保存中...' })
    wx.request({
      url: 'http://192.168.237.84/api/address.php?action=' + action,
      method: 'POST',
      data: data,
      success: (res) => {
        wx.hideLoading()
        // 兼容后端返回 PHP Warning + JSON 的情况
        let result = res.data
        if (typeof result === 'string') {
          const match = result.match(/\{[^}]+\}/)
          if (match) {
            try {
              result = JSON.parse(match[0])
            } catch (e) {}
          }
        }
        if (result && result.code === 200) {
          wx.showToast({ title: result.msg || '保存成功', icon: 'success' })
        } else {
          wx.showToast({ title: result && result.msg ? result.msg : '保存失败', icon: 'none' })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: '网络异常，已保存到本地', icon: 'none' })
      }
    })
  },

  goBack() {
    wx.navigateBack()
  }
})